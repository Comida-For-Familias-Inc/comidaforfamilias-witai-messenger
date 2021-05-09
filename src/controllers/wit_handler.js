//MongoClient
//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/mydb";


//main function for all messages
export function responseFromWit(intentData, entitiesData, traitsData) {
  //testing
  const testingintent = intentData.length > 0 && intentData[0] || "__foo__";
  
  console.log("TESTING: INTENT", testingintent);
  console.log("intentData[0]: ", intentData[0]);
  console.log("TraitsData: ", traitsData);
  //let boolean = traitsData.length > 0;
  console.log("BOOLEAN RESULT: ", traitsData['wit$bye'] && traitsData['wit$greetings']);

  if (testingintent == '__foo__'){
    return handleGibberish();
  }

  else if (intentData[0]){
    const intent = intentData[0];
    const intentname = intentData[0].name;
    const intentconfidence = intentData[0].confidence;

    //if(intentconfidence > 0.8){
    switch (intentname) {
      case "greetings":
        return handleGreeting();
        break;
      case "bye":
        return "Thank you for your interest in Comida For Familias. Have a great day!"; //make to function
        break;
      case "donate":
        return handleDonate();
        break;
      case "get_job_list":
        return handleGetJobList();
        break;
      case "get_location":
        return handleGetLocation();
        break;
      case "get_news":
        return handleGetNews();
        break;
      case "get_projects":
        return handleGetProjects();
        break;
      case "introduction":
        return handleIntroduction();
        break;
      case "join_volunteer":
        return handleJoinVolunteer();
        break;
      case "no_prob":
        return "You are very welcome."; //make to function
        break;
      case "opt_cpt":
        return handleOptCpt();
        break;
      case "organization_purpose":
        return handleOrganizationPurpose();
        break;
      }
    //}
  }

  else if(traitsData != {}){
    let traitsName = "default"
    let confidenceBye = "default"
    let confidenceGreeting = "default"

    if(traitsData['wit$bye'] && traitsData['wit$greetings']){
      confidenceBye = traitsData['wit$bye']['confidence']
      confidenceGreeting = traitsData['wit$greetings']['confidence']
      
      if(confidenceBye > confidenceGreeting){
        traitsName = "bye"
      }
      else{
        traitsName = "greetings"
      }
    }

    else if(traitsData['wit$bye'] && !traitsData['wit$greetings']){
      traitsName = "bye"
    }

    else{
      traitsName = "greetings"
    }
    
    
    switch (traitsName) {
    case "greetings":
      return handleGreeting();
      break;
    case "bye":
      return "Thank you for your interest in Comida For Familias. Have a great day!"; //make to function
      break;
    }
  }
  /*else {
    return handleGibberish();
  }*/


  console.log("data from wit (wit_handler.js):");

  let result = 'default';
  /*switch (intentname) {
    case "greetings":
      return handleGreeting();
      break;
    case "bye":
      return "Thank you for your interest in Comida For Familias. Have a great day!"; //make to function
      break;
    case "donate":
      return handleDonate();
      break;
    case "get_job_list":
      return handleGetJobList();
      break;
    case "get_location":
      return handleGetLocation();
      break;
    case "get_news":
      return handleGetNews();
      break;
    case "get_projects":
      return handleGetProjects();
      break;
    case "introduction":
      return handleIntroduction();
      break;
    case "join_volunteer":
      return handleJoinVolunteer();
      break;
    case "no_prob":
      return "You are very welcome."; //make to function
      break;
    case "opt_cpt":
      return handleOptCpt();
      break;
    case "organization_purpose":
      return handleOrganizationPurpose();
      break;
  }*/

  //return handleGibberish();
}


//function for handling meaningless messages
export function handleGibberish() {
  return "Ask me something like 'How do I join as a volunteer?' or 'What is Comida For Familias for?'";
}

function handleGreeting() {
  //let date = new Date();
  //var offset = new Date().getTimezoneOffset();
  //let time = date.getHours();
  //const greetingtest = entities['wit$greetings:greetings'];
  //console.log(greetingstest);

  const time = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  let greeting = ""

  console.log("TIME: ", time)
  if (time < 11){
     greeting = "good morning"
  } else if (time < 18){
    greeting = "good afternoon"
  } else if (time < 20){
    greeting = "good evening"
  } else {
    greeting = "Hello there"
  }

  return greeting;

}


//testing functions
function handleDonate() {
  let paypal = "Paypal";
  let paypalLink = string.link("https://www.paypal.com/us/fundraiser/charity/3792494");
  
  let message = "How would you like to donate?\n" + paypalLink;

  return message
}

function handleGetJobList() {
  /*MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    //Return only the "name" field in the result:
    db.collection("customers").find({}, { projection: { _id: 0, name: 1 } }).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
*/
  let page = "website";
  let pageLink = string.link("https://comidaforfamilias.org/getinvolved/positions");
  
  let message = "Positions available include recruiter, marketer, developer, designer, data scientist and so much more. Find out more about these position on" + page;

  return message;
}

function handleGetLocation() {
  return "get location"
}

function handleGetNews() {
  return "get news"
}
function handleGetProjects() {
  let page = "website";
  let pageLink = str.link("https://comidaforfamilias.org/projectList");

  let message = ""
  
  //message if they ask for current projects
  message = "Some projects we are currently working on are: \nTasteMatch." + "To Find out more visit our" + pageLink;
  //message if it is finished projects
  
  

  return message;
}
function handleIntroduction() {
  return "introduction"
}
function handleJoinVolunteer() {
  return "join as volunteer"
}
function handleOptCpt() {
  return "opt"
}
function handleOrganizationPurpose() {
  return "purpose"
}

//exports.responseFromWit = responseFromWit;