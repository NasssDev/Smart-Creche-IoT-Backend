import validator from './sensor.validator';
import { sensorController } from './sensor.controller';

export default (app) => {
    app.get('/api/sensor/runDataFetch',
        (req, res) => sensorController.runDataFetch(req, res));
    // app.get('/api/sensor_avg/:sensor_id',
    //     (req, res) => sensorController.getSensorAvg(req, res));
    // app.get('/api/sensor_avg/:location',
    //     (req, res) => sensorController.getSensorByLocation(req, res));
    
}
