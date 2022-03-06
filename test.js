
//const fast2sms = require("fast-two-sms"); 

//const client = require("twilio")('AC27d99c311a7c92a8ce032a14115f93f6', '2e9bc387acfff9db5551334938ce7829'); 

const Nexmo = require("nexmo"); 

// const tell = () => {
//     const obj = {
//         authorization : 'hZjxly012tcXpTvdmBrK5fA6ORGqnFPLV4H9IJaCS7WDbMskYoUadW2KIhnXvLiDSYrpM1wG98PFTb7A', 
//         message : 'Hello Bishal Your OTP CODE is 9630', 
//         number : ['7908683953']
//     }
//     fast2sms.sendMessage(obj).then((response) => {
//         console.log(response);   
//         //res.send(response);
//     }).catch((error) => {
//         console.log(error);   
//         //res.send(error); 
//     }); 
// }

// tell(); 

//const client = new twilio('2e9bc387acfff9db5551334938ce7829'); 
//_GAF1qLtJ0cdM0o0YOoxZS7qigpjzUxuF0n_-BIP VVI 

// client.messages.create({
//     body: 'HELLO BISHAL YOU ONE TIME OTP IS 9630',
//     to: '+917908683953',
//     from: '+19146859161'
//  }).then(message => console.log(message)).catch(error => console.log(error))
// console.log("SMS SENT ! "); 

const nexmo = new Nexmo({
    apiKey : '410af74e',
    apiSecret : 'XQn0QQTBsehAanUQ', 
}); 

const from = "Vonage APIs"; 
const to = "8372805832"; 
const text = "HELLO USER BISHAL SARKAR"; 

nexmo.message.sendSms(from,to,text)
console.log("SMS SENT ! "); 
