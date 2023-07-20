import validator from './siestMode.validator';
import { siestModeController } from './siestMode.controller';

export default (app) => {
    app.get('/api/sleep_mode/on',
    (req, res) => siestModeController.onMode(req, res));
    app.get('/api/sleep_mode/off',
    (req, res) => siestModeController.offMode(req, res));
} 