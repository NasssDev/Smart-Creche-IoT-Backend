import { NodeSensorRecord } from "../components/sensor/model/nodeSensor.model";
import sensorHelper from "../components/sensor/sensor.helper";


class ManageSensorValue {
    public async manageValue() {
        const roomIds = ['d9be4235-0aec-40bb-8915-f679a71c890d', '63c09edc-771b-4e15-ab00-237bb926b040', '578cf6dc-d4ee-4799-a069-5fe91da86084'];
        const list = []
        for(let i = 0; i<roomIds.length; i++){
            const sensors = await NodeSensorRecord.find({roomId: roomIds[i] }).lean()
            for(let j = 0; j<sensors.length; j++){
                    //setInterval(function(){
                       await sensorHelper.getData(roomIds[i], sensors[j].nodeId, sensors[j].sensorId);
                       console.log('Entry done', roomIds[i], sensors[j].nodeId, sensors[j].sensorId);
                    //}, 30000)}               
        }

        //Promise.all(list)
    }
}}

export const manageSensorValue = new ManageSensorValue();
