require("dotenv").config();
import request from "request";
import axios from "axios";
// import audioLoader from "audio-loader";
// var load = require('audio-loader')
import createBuffer from 'audio-buffer-from';
// var createBuffer = require('audio-buffer-from')



const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const WIT_TOKEN = process.env.WIT_TOKEN;

let Wit = require('../config/wit');
let log = require('../config/log');


//wit_handler
const wit_handler = require("./wit_handler");

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  logger: new log.Logger(log.INFO)
});

let test = (req, res) => {
  return res.send("HELLO World");
}

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = FB_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

let postWebhook = (req, res) => {
  //extracts from event
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
          const sender = event.sender.id;

          // We could retrieve the user's current session, or create one if it doesn't exist
          // This is useful if we want our bot to figure out the conversation history
          // const sessionId = findOrCreateSession(sender);

          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            callSendAPI(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
          } else if (text) {
            // We received a text message
            // Let's run /message on the text to extract some entities, intents and traits
            wit.message(text).then(({entities, intents, traits}) => {
              console.log("WIT.MESSAGE(text)", wit.message(text));
              
              // You can customize your response using these
              console.log("INTENTS", intents);
              console.log("ENTITIES", entities);
              console.log("TRAITS", traits);
              // For now, let's reply with another automatic message

              //const intent = Promise.resolve(wit.message(intents));
              
              console.log("INTENT[0].NAME: ", intents[0].name);
              
              const wit_result = wit_handler.responseFromWit(intents, wit.message);

              //callSendAPI(sender, `We've received your message: ${text}.`);
              callSendAPI(sender, wit_result);
            })
            .catch((err) => {
              console.error('Oops! Got an error from Wit: ', err.stack || err);
            })
          }
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
}


module.exports = {
  test: test,
  getWebhook: getWebhook,
  postWebhook: postWebhook
};

/*
// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    } else if (received_message.attachments) {

        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;


        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }


    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}
*/


// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": { "text": response }
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v10.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}












//Handling Natural language processing
function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}


function handleMessage(sender_psid, message) {
  let response;

  const url = "https://api.wit.ai/speech";
  const witToken = process.env.WIT_TOKEN; 


    // Checks if the message contains text
  /*if (message.text) {
    // Creates the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${message.text}". Now send me an attachment!`
    }
  }*/
    //else {

      axios
        .post(url, buffer, {
          headers: {
            Authorization: "Bearer " + witToken,
            "Content-Type": "text"
          }
        })

        .then(witResponse => {
          console.log("wit response: " + JSON.stringify(witResponse.data));
          // res.json(witResponse.data);
        })

        .catch(e => {
          console.log("error sending to wit: " + e);
          // res.json({ error: e.message });
        });
    //}

  // check greeting is here and is confident
  //console.log(message.intents);
  const greeting0 = firstTrait(message.nlp, 'wit$greetings');
  const greeting2 = firstTrait(message.nlp, 'afternoon_greeting');
  
  console.log("TONY TEST");
  console.log("GREETING0: ", greeting0)
  console.log("GREETING2: ", greeting2)
  console.log("MESSAGE: ", message)
  console.log("MESSAGE.nlp: ", message.nlp)
  console.log("MESSAGE.NLP.INTENT", message.nlp.intents);
  console.log("END OF TONY TEST");

  console.log("data from wit:");
  console.log(JSON.stringify(message));
  //const intent = message.nlp.intents.length > 0 && message.nlp.intents[0] || "__foo__";

  const intent = message.nlp.intents;
  console.log("INTENT IS   ", intent)
  console.log(intent.name);

    
    //return handleGibberish();
  /*const greeting = firstTrait(message.nlp, 'wit$greetings');
  if (greeting && greeting.confidence > 0.8) {
    callSendAPI(sender_psid,'Hi there!');
  } else { 
    // default logic
    callSendAPI(sender_psid,'default');
  }*/
  callSendAPI(sender_psid, result)
}


function handleGibberish() {
    return Promise.resolve(
      "ask me something like 'How do I join as a volunteer?' or 'What is Comida For Familias for?'"
    );
  }



/*
function handleMessage(sender_psid, received_message) {
  console.log("Start of handleMessage");
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Creates the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments)
  
  /*VOICE MESSET
  
  else if (received_message.attachments) {
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    console.log("attachment_url", attachment_url);
    let audioObj = new Audio(attachment_url);
    console.log("audioObj", audioObj);

    // fetch(attachment_url)
    // .then(response => response.blob())
    // .then(blob => {
    //   // use blob here...
    //   console.log('blob', blob);
    // });


    const url = "https://api.wit.ai/speech";
    const witToken = process.env.WIT_TOKEN; //don't put your token inline
    // console.log("audioObj", audioObj);

      console.log("buffer", buffer);

      axios
        .post(url, buffer, {
          headers: {
            Authorization: "Bearer " + witToken,
            "Content-Type": "audio/wav"
          }
        })

        .then(witResponse => {
          console.log("wit response: " + JSON.stringify(witResponse.data));
          // res.json(witResponse.data);
        })

        .catch(e => {
          console.log("error sending to wit: " + e);
          // res.json({ error: e.message });
        });
    }
    
    // Sends the response message
    // callSendAPI(sender_psid, response); 

    // check greeting is here and is confident
    const greeting = firstTrait(received_message.nlp, 'wit$greetings');
    console.log("GREETING", greeting);

    console.log("received_message", received_message);
    // console.log("CallSENDAPI", callSendAPI());

    handler.responseFromWit
    if (greeting && greeting.confidence > 0.8) {
      callSendAPI(sender_psid, 'Hi there!');
    } else {
      // default
      callSendAPI(sender_psid, 'default');
    }
  }
} 

*/