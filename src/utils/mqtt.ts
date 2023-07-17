import mqtt from 'mqtt';
const client: mqtt.MqttClient = mqtt.connect("mqtt://mqtt.arcplex.fr:2295", {
  username: "groupe8",
  password: "1IC5VzoA7T4c"
});
client.on('connect', () => {
    console.log("Connected MQTT!");
  });
  
export default client;
