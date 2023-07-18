import { logger } from '../../utils/logger';
import { Helper } from '../../utils/helper';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserRecord } from './user.model';
import ServiceError from '../../utils/serviceError';
import { RoleRecord } from '../role/role.model';
import { UserRoleRecord } from '../userRole/userRole.model';
import { Constants } from '../../utils/constants/constant';
import { SessionRecord } from '../session/session.model';
import { AccountRecord } from '../account/account.model';
import { Common } from '../common';
import * as _ from 'lodash';
import crypto from 'crypto';
import CustomError from '../../utils/customError';

class UserHelper {
   /**
    * @description create user
    */
   public async createUser({
      email,
      firstName,
      lastName,
      roleId,
      accountId,
      createdBy: createdBy
   }: {
      email;
      firstName;
      lastName;
      roleId;
      accountId;
      createdBy;
   }) {
      try {
         let validationPromise = [],
            accountDetail,
            createdByUserDetail,
            isNewUser = false;

         validationPromise.push(
            /** validate user role */
            new Promise(async (resolve, reject) => {
               /** find role */
               let roleDetail = await RoleRecord.findOne(
                  {
                     _id: roleId
                  },
                  '_id'
               );

               if (!roleDetail) {
                  return reject(new ServiceError('NOT_EXIST_ROLE'));
               }
               return resolve(true);
            }),
            /** get account detail */
            new Promise(async (resolve, reject) => {
               let account = await AccountRecord.findOne({ _id: accountId }, 'name');

               if (!account) {
                  return reject(new ServiceError('NOT_EXIST_ORG'));
               }

               accountDetail = account;
               return resolve(true);
            }),
            /** get created by user detail */
            new Promise(async (resolve, reject) => {
               /** get user detail with same email */
               let userDetail = await UserRecord.findOne(
                  {
                     _id: createdBy,
                     isDeleted: false
                  },
                  '_id email'
               );

               if (!userDetail) {
                  return reject(new ServiceError('CREATED_BY_USER_NOT_FOUND'));
               }

               createdByUserDetail = userDetail;

               return resolve(true);
            })
         );

         await Promise.all(validationPromise);

         /** get user detail with same email */
         let userDetail = await UserRecord.findOne(
            {
               email,
               isDeleted: false
            },
            '_id'
         );

         /** generate random password */
         let invitationToken = crypto.randomBytes(16).toString('hex');
         let invitationExpireToken = Common.createSetPasswordToken({
            data: {},
            expiresIn: Constants.INVITE_EXPIRE_IN
         })?.token;

         const session = await mongoose.startSession();
         session.startTransaction();

         try {
            if (!userDetail) {
               isNewUser = true;

               /** create user */
               [userDetail] = await UserRecord.create(
                  [
                     {
                        email,
                        firstName,
                        lastName,
                        roleId,
                        loginAccountId: accountId,
                        registrationStatus: 4,
                        createdBy: createdBy,
                        resetPassword: true
                     }
                  ],
                  { session }
               );
            }

            let userRoleDetail = await UserRoleRecord.findOne({ userId: userDetail._id, accountId });

            if (userRoleDetail) {
               throw new CustomError('USER_ALREADY_EXIST');
            } else {
               /** create user role */
               await UserRoleRecord.create(
                  [
                     {
                        userId: userDetail._id,
                        accountId,
                        roleId: roleId,
                     }
                  ],
                  {
                     session
                  }
               );
            }

            await session.commitTransaction();
            session.endSession();
         } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
         }

         return { isNewUser };
      } catch (error) {
         logger.error(__filename, {
            method: 'createUser',
            requestId: '',
            custom_message: 'Error while creating user',
            error
         });
         throw error;
      }
   }

   /**
    * @description update user
    */
   public async updateUser({
      updateObj,
      userId,
      updatedBy: updatedBy,
      accountId
   }: {
      updateObj: {
         email?;
         firstName?;
         lastName?;
         roleId?;
         language?;
      };
      userId;
      accountId;
      updatedBy;
   }) {
      try {
         let validationPromise = [];

         /** validate user detail  */
         let oldUserDetail = await UserRecord.findOne(
            {
               _id: userId,
               loginAccountId: accountId,
               isDeleted: false
            },
            '_id'
         );

         if (!oldUserDetail) {
            throw new ServiceError('USER_NOT_EXIST');
         }

         if (updateObj.email) {
            validationPromise.push(
               /** check email */
               new Promise(async (resolve, reject) => {
                  /** get user detail */
                  let userDetail = await UserRecord.findOne(
                     {
                        email: updateObj.email,
                        isDeleted: false,
                        _id: {
                           $ne: oldUserDetail._id
                        }
                     },
                     '_id'
                  );

                  if (userDetail) {
                     return reject(new ServiceError('EMAIL_ALREADY_EXIST'));
                  }
                  return resolve(true);
               })
            );
         }

         if (updateObj.roleId) {
            validationPromise.push(
               /** validate user role */
               new Promise(async (resolve, reject) => {
                  /** check email */
                  let roleDetail = await RoleRecord.findOne(
                     {
                        _id: updateObj.roleId
                     },
                     '_id'
                  );

                  if (!roleDetail) {
                     return reject(new ServiceError('NOT_EXIST_ROLE'));
                  }
                  return resolve(true);
               })
            );
         }

         await Promise.all(validationPromise);

         /** prepare update user detail obj */
         let updateUserObj = { updatedBy };

         Object.keys(updateObj).forEach((key) => {
            if (updateObj[key]) {
               switch (key) {
                  case 'email':
                  case 'firstName':
                  case 'lastName':
                  case 'language':
                     updateUserObj[key] = updateObj[key];
                     break;
                  default:
                     break;
               }
            }
         });

         const session = await mongoose.startSession();
         session.startTransaction();

         try {
            /** create user */
            await UserRecord.updateOne(
               {
                  _id: oldUserDetail._id
               },
               { $set: updateUserObj },
               { session }
            );

            if (updateObj.roleId) {
               /** update user role */
               await UserRoleRecord.updateOne(
                  {
                     userId: oldUserDetail._id
                  },
                  {
                     $set: { role: updateObj.roleId, updatedBy }
                  },
                  { session }
               );
            }

            await session.commitTransaction();
            session.endSession();
         } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
         }
      } catch (error) {
         logger.error(__filename, {
            method: 'updateUser',
            requestId: '',
            custom_message: 'Error while updating user',
            error
         });
         throw error;
      }
   }

   /**
    * @description remove user
    */
   public async removeUser({ userId, updatedBy, accountId }: { userId; accountId; updatedBy }) {
      try {
         /** validate user detail  */
         let oldUserDetail = await UserRecord.findOne(
            {
               _id: userId,
               isDeleted: false
            },
            '_id'
         );

         if (!oldUserDetail) {
            throw new ServiceError('USER_NOT_EXIST');
         }

         const session = await mongoose.startSession();
         session.startTransaction();

         try {
            await UserRoleRecord.findOneAndUpdate(
               {
                  userId: oldUserDetail._id,
                  accountId
               },
               {
                  $set: {
                     isDeleted: true,
                  }
               },
               { session }
            );

            /**
             * remove user session
             */
            await this.removeUserSession({
               transactionSession: session,
               userId: oldUserDetail._id,
               accountId
            });

            await session.commitTransaction();
            session.endSession();
         } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
         }
      } catch (error) {
         logger.error(__filename, {
            method: 'removeUser',
            requestId: '',
            custom_message: 'Error while removing user',
            error
         });
         throw error;
      }
   }

   /**
    * @description change password
    */
   public async changePassword({
      userId,
      accountId,
      newPassword,
      currentPassword,
      sessionId
   }: {
      userId;
      accountId;
      newPassword;
      currentPassword;
      sessionId;
   }) {
      try {
         /** validate user detail  */
         let userDetails = await UserRecord.findOne(
            {
               _id: userId,
               loginAccountId: accountId,
               isDeleted: false
            },
            '_id password email firstName lastName'
         );

         if (!userDetails) {
            throw new ServiceError('USER_NOT_EXIST');
         }

         const isPwdMatching = await bcrypt.compare(currentPassword, userDetails.password);

         if (!isPwdMatching) {
            throw new ServiceError('INVALID_CREDENTIALS');
         }

         /** update user password */
         const encryptedPassword = await bcrypt.hash(newPassword, Constants.PASSWORD.SALT_ROUND);

         const session = await mongoose.startSession();
         session.startTransaction();

         try {
            /** create user */
            await UserRecord.updateOne(
               {
                  _id: userId
               },
               {
                  $set: {
                     password: encryptedPassword,
                     updatedBy: userId
                  }
               },
               { session }
            );

            await this.removeUserSession({ sessionId, userId, transactionSession: session });

            await session.commitTransaction();
            session.endSession();
         } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
         }

         
      } catch (error) {
         logger.error(__filename, {
            method: 'changePassword',
            requestId: '',
            custom_message: 'Error while changing user',
            error
         });
         throw error;
      }
   }

   /**
    * @description remove user session
    */
   public async removeUserSession({
      sessionId,
      userId,
      accountId,
      transactionSession
   }: {
      sessionId?;
      userId;
      transactionSession?;
      accountId?;
   }) {
      try {
         let removeSessionCondition: any = {
            _id: sessionId,
            userId
         };

         if (userId) {
            removeSessionCondition.userId = userId;
         }

         if (accountId) {
            removeSessionCondition.accountId = accountId;
         }

         /** remove session */
         await SessionRecord.deleteOne({
            _id: sessionId,
            userId
         }).session(transactionSession);
      } catch (error) {
         logger.error(__filename, {
            method: 'removeUserSession',
            requestId: '',
            custom_message: 'Error while removing user session',
            error
         });
         throw error;
      }
   }

   /**
    * @description remove user session
    */
   public async userSignIn(userDetail, accountDetail, userRoleDetail) {
      try {
         /** create user session */
         let sessionData;

         await SessionRecord.create({
            userId: userDetail._id,
            accountId: accountDetail?._id
         });
        
         //userDetail = _.omit(userDetail, ['password']);

         const tokenData = Common.createToken({ user: userDetail, userRole: userRoleDetail, session: sessionData });
         console.log(tokenData);
         

         return tokenData
      } catch (error) {
         logger.error(__filename, {
            method: 'userSignIn',
            requestId: '',
            custom_message: 'Error while signing user',
            error
         });
         throw error;
      }
   }
}

export default new UserHelper();
