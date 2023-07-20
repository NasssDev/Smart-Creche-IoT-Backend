import { NodeSensorRecord } from "../components/sensor/model/nodeSensor.model";
import sensorHelper from "../components/sensor/sensor.helper";

class ManageSensorValue {
    public async manageValue() {
        const roomIds = ['d9be4235-0aec-40bb-8915-f679a71c890d',
            '63c09edc-771b-4e15-ab00-237bb926b040', '578cf6dc-d4ee-4799-a069-5fe91da86084'
        ];
        for (let i = 0; i < roomIds.length; i++) {
            const sensors = await NodeSensorRecord.find({ roomId: roomIds[i] }).lean();
            const promises = sensors.map((sensor) => {
              return sensorHelper.getData(roomIds[i], sensor.nodeId, sensor.sensorId);
            });
            // Wait for all promises to resolve concurrently
            await Promise.all(promises);
          }
            // sensorHelper.getData("63c09edc-771b-4e15-ab00-237bb926b040", "5e1a9895-94fb-4a3d-9332-3ae669549715", 116);

    }
    

}

export const manageSensorValue = new ManageSensorValue();
