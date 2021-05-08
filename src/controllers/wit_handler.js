//main function for all messages
export function responseFromWit(data) {
    console.log("data from wit:");
    console.log(JSON.stringify(data));
  
    const intent = data.intents.length > 0 && data.intents[0] || "__foo__";
    
    switch (intent.name) {
      case "afternoon_greeting":
        return "Good afternoon!";
      case "bye":
        return "Thank you for your interest in Comida For Familias. Have a great day!";
      case "donate":
        return handleDonate(data);
      case "evening_greeting":
        return "Good evening!";
      case "get_job_list":
        return handleGetJobList(data);
      case "get_location":
        return handleGetLocation(data);
      case "get_news":
        return handleGetNews(data);
      case "get_projects":
        return handleGetProjects(data);
      case "greetings":
        return "Hello! Welcome to the Facebook page of Comida For Familias.";
      case "introduction":
        return handleIntroduction(data);
      case "join_volunteer":
        return handleJoinVolunteer(data);
      case "morning_greeting":
        return "Good morning!";
      case "no_prob":
        return "You are very welcome.";
      case "opt_cpt":
        return handleOptCpt(data);
      case "organization_purpose":
        return handleOrganizationPurpose(data);
    }
    
    return handleGibberish();
  }
  
  
  //function for handling meaningless messages
export function handleGibberish() {
    return Promise.resolve(
      "ask me something like 'How do I join as a volunteer?' or 'What is Comida For Familias for?'"
    );
  }



function handleDonate(data){
  return "Test"
}

function handleGetJobList(data){
  return "Test"
}

function handleGetLocation(data){
  return "Test"
}

function handleGetNews(data){
  return "Test"
}
function handleGetProjects(data){
  return "Test"
}
function handleIntroduction(data){
  return "Test"
}
function handleJoinVolunteer(data){
  return "Test"
}
function handleOptCpt(data){
  return "Test"
}
function handleOrganizationPurpose(data){
  return "Test"
}

//exports.responseFromWit = responseFromWit;