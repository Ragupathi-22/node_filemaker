// Common Responses
const routeNotFound = JSON.stringify({ 
    title: "Route Not Found", 
    messages: [{ message: "Failed" }] 
  });
  
  const internalServerError = JSON.stringify({ 
    title: "Internal Server Error" ,
    messages: [{ message: "Failed" }] 
  });
  
  const recordNotFound = JSON.stringify({ 
    title: "Record not found" ,
    messages: [{ message: "Failed" }] 
  });
  
  const badRequest = JSON.stringify({ 
    title: "Invalid request" ,
    messages: [{ message: "Failed" }] 
  });

  const messageFailed=[
    {
      "message": "Failed"
    }
  ];
  const messageSuccess=[
    {
      "message": "OK"
    }
  ];
  
  // Export Constants
  module.exports = {
    routeNotFound,
    internalServerError,
    recordNotFound,
    badRequest,
    messageFailed,
    messageSuccess
  };
  