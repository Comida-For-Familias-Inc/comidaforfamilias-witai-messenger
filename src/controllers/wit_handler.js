//main function for all messages
export function responseFromWit(data, wit_message) {
  const intent = data[0];
  const intentname = data[0].name;
  const intentconfidence = data[0].confidence;

  console.log("data from wit (wit_handler.js):");
  console.log(JSON.stringify(data));

  let result = 'default';
  switch (intentname) {
    case "afternoon_greeting":
      return result = "Good afternoon!";
      break;
    case "bye":
      return result = "Thank you for your interest in Comida For Familias. Have a great day!";
      break;
    case "donate":
      result = handleDonate();
      break;
    case "evening_greeting":
      return result = "Good evening!";
      break;
    case "get_job_list":
      result = handleGetJobList();
      break;
    case "get_location":
      result = handleGetLocation();
      break;
    case "get_news":
      result = handleGetNews();
      break;
    case "get_projects":
      result = handleGetProjects();
      break;
    case "greetings":
      return result = "Hello! Welcome to the Facebook page of Comida For Familias.";
      break;
    case "introduction":
      result = handleIntroduction();
      break;
    case "join_volunteer":
      result = handleJoinVolunteer();
      break;
    case "morning_greeting":
      return result = "Good morning!";
      break;
    case "no_prob":
      return result = "You are very welcome.";
      break;
    case "opt_cpt":
      result = handleOptCpt();
      break;
    case "organization_purpose":
      result = handleOrganizationPurpose();
      break;
  }

  return handleGibberish();
}


//function for handling meaningless messages
export function handleGibberish() {
  return Promise.resolve(
    "ask me something like 'How do I join as a volunteer?' or 'What is Comida For Familias for?'"
  );
}


//testing functions
function handleDonate() {
  return "donate"
}

function handleGetJobList() {
  return "get job list"
}

function handleGetLocation() {
  return "get location"
}

function handleGetNews() {
  return "get news"
}
function handleGetProjects() {
  return "get projects"
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