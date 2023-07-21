import validator from './siestMode.validator';
import { siestModeController } from './siestMode.controller';
import { Common } from '../common';
export default (app) => {
    app.get('/api/sleep_mode/on',
    [Common.authenticateToken, Common.authenticateAccount],
    (req, res) => siestModeController.onMode(req, res));
    app.get('/api/sleep_mode/off',
    [Common.authenticateToken, Common.authenticateAccount],
        (req, res) => siestModeController.offMode(req, res));
    app.get('/api/sleep_mode_info',
            (req, res) => siestModeController.getInfo(req, res));
        
    
} 