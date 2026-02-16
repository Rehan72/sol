const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com');
const plantId = '7b5d11fe-bddd-472c-85cb-460b582b793a'; // Valid ID from logs

client.on('connect', () => {
    console.log('Test Client Connected');
    
    // Subscribe to commands
    client.subscribe(`tekmindz/solar/${plantId}/command`, (err) => {
        if (!err) console.log(`Subscribed to tekmindz/solar/${plantId}/command`);
    });

    // Publish telemetry every 5 seconds
    setInterval(() => {
        const telemetry = {
            kw: 50 + Math.random() * 10,
            efficiency: 18 + Math.random() * 2,
            temp: 25,
            moduleTemp: 35,
            irradiance: 800
        };
        client.publish(`tekmindz/solar/${plantId}/telemetry`, JSON.stringify(telemetry));
        console.log('Published telemetry:', telemetry);
    }, 5000);
});

client.on('message', (topic, message) => {
    console.log(`Received Command on [${topic}]:`, message.toString());
});
