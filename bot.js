const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {GoogleGenerativeAI} = require('@google/generative-ai');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-pro"});


async function generate(prompt,message,chat){


    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    await message.reply(text);

}

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});
  
client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

client.on('ready', () => {
    console.log('Client is ready!');
});
  
client.on('disconnected', () => {
    console.log('Client is disconnected!');
});
  
client.on('auth_failure', () => {
    console.log('Client is auth_failure!');
});

client.on('message',async (message)=>{

    if(message.body.includes('.bot')){

        var query;
        
        const regxmatch = message.body.match(/.bot(.+)/);   

        if (regxmatch) {
            query = regxmatch[1];
        }
        else{
            console.log("No regex match!");
            query="Hi";
        }
        const chat = model.startChat({
            history:[{
                        role: "user",
                        parts: "I want to chat today, please answer in as minimum word as you can, do not include unnecessary things, give clear and precise answer and if you user asks you to generate more than 500 words just reply with sorry and told your token limit to him",
                    },
                    {
                        role: "model",
                        parts: "Great to meet you. I will try to answer as short as possible according to the query,I will use max words of 500 if required, What would you like to know?",
                    },],
          });

        generate(query,message,chat);
    };

});

client.initialize();
 