import validator from './sensor.validator';
import { sensorController } from './sensor.controller';

export default (app) => {
    app.get('/api/sensor/runDataFetch',
        (req, res) => sensorController.runDataFetch(req, res));
    // app.post('/api/sensor/add',
    //     (req, res) => sensorController.addSensor(req, res));
    app.get('/api/sensors/:location',
        (req, res) => sensorController.getSensorByLocation(req, res));
    app.get('/api/sensor_val_avg/:id',
        (req, res) => sensorController.getSensorValAvg(req, res));

}
