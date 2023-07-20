import validator from './user.validator';
import { userController } from './user.controller';
import { Common } from '../common';

export default (app) => {
    app.post('/api/signup',
    validator.signupValidator, 
    (req, res) => userController.signup(req, res));

    app.post('/api/signin',
    validator.signinValidator, 
    (req, res) => userController.signin(req, res));

    app.post('/api/password/1',
    validator.resetPwd1Validator, 
    (req, res) => userController.resetPassword(req, res));

    app.post('/api/password/2',
    validator.resetPwd2Validator, 
    (req, res) => userController.checkOtp(req, res));

    app.post('/api/password/3',
    [Common.authenticateToken, Common.authenticateAccount],
    validator.resetPwd3Validator, 
    (req, res) => userController.changePassword(req, res));

    app.get('/api/profil',
    [Common.authenticateToken, Common.authenticateAccount],
    (req, res) => userController.getProfil(req, res));

    app.put('/api/profil',
    [Common.authenticateToken, Common.authenticateAccount],
    validator.updateProfilValidator, 
    (req, res) => userController.updateProfil(req, res));

    app.post('/api/logout',
    [Common.authenticateToken, Common.authenticateAccount],
    (req, res) => userController.logout(req, res));
}