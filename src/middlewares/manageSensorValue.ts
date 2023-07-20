import { NodeSensorRecord } from "../components/sensor/model/nodeSensor.model";
import sensorHelper from "../components/sensor/sensor.helper";

const list = 
[
    {
        "nodeId": "772946e8-a922-4ffe-8c57-ad3815604b1c",
        "sensorId": "136",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "07b4bbea-f873-4677-8bdb-c4bdb2849424",
        "sensorId": "100",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "4bce632e-41d5-4266-862a-681d3874ea62",
        "sensorId": "103",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "4e9e27ee-e2ed-4de8-a59a-cc810cf21c29",
        "sensorId": "104",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "4f5843f2-5aef-465d-ac87-61c5a5d8f16a",
        "sensorId": "112",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "53df5d00-7c48-4ea8-a02c-240b3dace495",
        "sensorId": "118",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "54b2f240-b7e7-4779-8c11-481441a29ca1",
        "sensorId": "114",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "56cb6869-db15-464a-b02e-a8ef6c6c89a5",
        "sensorId": "116",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "2b4eb524-22e2-477c-9fb1-f3a4c38cc8d6",
        "sensorId": "128",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "67caecd8-d5f1-44e1-8cc0-ba39fd28b132",
        "sensorId": "131",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "a20575cf-81af-4dbc-a529-036c5b599549",
        "sensorId": "115",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "aa6e586e-39ef-465d-ba7e-a1f2f2de70cc",
        "sensorId": "101",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "c1cb4ff5-bef2-47ad-9443-7271bd0e04f1",
        "sensorId": "102",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "f973c807-36d6-4bf6-8d39-c747edc6acaa",
        "sensorId": "119",
        "roomId": "d9be4235-0aec-40bb-8915-f679a71c890d"
    },
    {
        "nodeId": "0519adec-dcf7-40f2-a73d-3ca7cb3a3dcd",
        "sensorId": "118",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "16a9ea54-935f-4177-9d1f-9f0a950926cc",
        "sensorId": "115",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "4e719731-ac7a-438d-aa39-320ea41d4c03",
        "sensorId": "100",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "549d4376-349a-499d-9c4e-025d3a0b65d1",
        "sensorId": "103",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "572cdb78-2308-4d30-81b3-8fc7cad46dab",
        "sensorId": "136",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "5cee9b96-fec0-4a09-9f8f-eb6ea1ebdf9f",
        "sensorId": "119",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "5e1a9895-94fb-4a3d-9332-3ae669549715",
        "sensorId": "116",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "2e9ce1ea-5c8c-4758-9a8c-f42435be53e0",
        "sensorId": "114",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "6d6a977a-0e29-4208-823b-2773012512e9",
        "sensorId": "102",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "95adf078-9973-45f4-9c6a-2aab45fdc718",
        "sensorId": "112",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "a0f1596d-cd9c-48e9-87ac-b49bc92e83e0",
        "sensorId": "128",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "b015e8a7-4120-4e05-8ba0-c681577aaa04",
        "sensorId": "131",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "e9f670bb-9b7e-412a-beaf-376f029b3445",
        "sensorId": "104",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "fb6e3f2d-e551-48ea-9794-d6af2029a67a",
        "sensorId": "101",
        "roomId": "63c09edc-771b-4e15-ab00-237bb926b040"
    },
    {
        "nodeId": "0c288be6-6a4e-4b31-80ef-de2238ace1a0",
        "sensorId": "116",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "46a947a7-f1c2-4e65-bfcd-e2ce73eb317c",
        "sensorId": "102",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "8107b144-10a3-443d-911c-ed7c87ebc65f",
        "sensorId": "131",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "4cdae47f-9c10-4fea-bb1a-742822badbc5",
        "sensorId": "119",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "194b1357-d22b-4b36-97fd-e7ea50ea1c9c",
        "sensorId": "103",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "221908be-142b-4f15-9e83-12017a381ea2",
        "sensorId": "118",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "5a0e2edd-b914-4b00-a446-6a9ca202765a",
        "sensorId": "112",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "664fbfa5-08ce-4cbe-a046-300c58125ece",
        "sensorId": "104",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "315556fb-9218-463e-b377-8457aec801e6",
        "sensorId": "100",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "326dc3b8-873a-41a1-8f1f-c9f1af7d9c0f",
        "sensorId": "101",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "9eb7db61-23e5-406f-b6b6-8676dd5c1aab",
        "sensorId": "114",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "de9e73fa-ea99-4ee0-ba70-320961dda533",
        "sensorId": "136",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "e0df3acb-c423-4aba-8716-74eb1998f372",
        "sensorId": "115",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    },
    {
        "nodeId": "fb8ef424-feac-4fa8-8c7b-7e102c9aeaae",
        "sensorId": "128",
        "roomId": "578cf6dc-d4ee-4799-a069-5fe91da86084"
    }
];
class ManageSensorValue {
    public async manageValue() {
        const roomIds = ['d9be4235-0aec-40bb-8915-f679a71c890d', '63c09edc-771b-4e15-ab00-237bb926b040', '578cf6dc-d4ee-4799-a069-5fe91da86084'];
        // for(let i = 0; i<roomIds.length; i++){
        //     const sensors = await NodeSensorRecord.find({roomId: roomIds[i] }).lean()
        //     for(let j = 0; j<sensors.length; j++){
        //         console.log(roomIds[i], sensors[j].nodeId, sensors[j].sensorId); 
        //         sensorHelper.getData(roomIds[i], sensors[j].nodeId, sensors[j].sensorId);
        // }

        for(let i = 0; i<list.length; i++){
            console.log(list[i]['roomId'], list[i]['nodeId'], list[i]['sensorId']);
            
            sensorHelper.getData(JSON.stringify(list[i]['roomId']), JSON.stringify(list[i]['nodeId']), Number(list[i]['sensorId']));
        }

    }

}

export const manageSensorValue = new ManageSensorValue();
