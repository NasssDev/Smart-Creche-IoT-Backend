import validator from './userRole.validator';
import { userRoleController } from './userRole.controller';
import { Common } from '../common';

export default (app) => {
    app.get('/api/role',
    (req, res) => userRoleController.getroles(req, res));
}