import validator from './user.validator';
import { userController } from './user.controller';
import { Common } from '../common';

export default (app) => {
    app.post('/api/signup', 
    (req, res) =>
    userController.signup(req, res));
}