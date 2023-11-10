let resmsg= {
    serverError:{statusCode:500,status:false,statusText:"find some error from server"},
    credNotMetch: {statusCode:200,status:false,statusText:"credintial not matched"},
    blankFeilds: {statusCode:200,status:false,statusText:"please feel necessery fields"},
    invalidCred:{status: false,message: 'Invalid Credentials',data: []}
    // Add more messages here
};
export {resmsg}