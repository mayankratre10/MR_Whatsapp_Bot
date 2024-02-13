//Require the qrcode package
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
	//its generate the qrcode in terminal, option small to generate small qr code
    qrcode.generate(qr, { small: true }); 
});

//this event is triggered when client is authenticated and ready
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message',(message)=>{
    console.log(message.body);
})

client.initialize();
 