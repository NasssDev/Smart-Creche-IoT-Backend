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
}