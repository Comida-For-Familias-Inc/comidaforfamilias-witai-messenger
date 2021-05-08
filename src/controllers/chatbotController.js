require("dotenv").config();
import request from "request";
import axios from "axios";
// import audioLoader from "audio-loader";
// var load = require('audio-loader')
import createBuffer from 'audio-buffer-from';
// var createBuffer = require('audio-buffer-from')

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const WIT_TOKEN = process.env.WIT_TOKEN;

//wit_handler
const handler = require("./wit_handler");

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

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }

    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
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
  } else 
  
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

    audioLoader(attachment_url).then(function (buffer) {
      // buffer is an AudioBuffer
      // play(buffer)
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
    });
    */
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

