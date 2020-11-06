const BaseFunction      = require("./baseFunction");
const tokenLogin        = require("../services/tokenLogin");
const httpStatusCode    = require("http-status-codes");
const Boom              = require("@hapi/boom")
let self

const onConfig = () => ({
  application: process.env.SERVICE,
  environment: process.env.STAGE
});

class BaseHttpFunction extends BaseFunction {

  constructor(event, context, callback, coldStart) {
    super(event, context, callback, coldStart);
        
    this.start  =  new Date;
    this.headers =  {
      'Content-Type' : 'application/json',
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
      "ProcessId": this.processId
    }

    self = this;

    if(self.event != null && coldStart) {
      self.event.coldStart = coldStart;
    }

    /** Immediate response for WarmUP plugin */
    if (event != null && event.source === 'serverless-plugin-warmup') {
      self.event.warmup = true;
      self.httplog(200, self.queryparameters, self.event, self.start, {});
      return callback(null, 'Lambda is warm!')
    }

  }

  run() {
        
    let token       = self.getAccessTokenValue();
    let signature   = self.getSignatureValue();

    if(token != null && signature != null) {
      self.logger.log("Access Token found")
      self.connectDB().then(function() {
        tokenLogin.getToken(token, signature).then(function(_signature){
          self.event.customerId = _signature;
          self.runHttp()
        })
      }).catch(function(err) {
        /* istanbul ignore next */
        self.logerror("baseHttpFunction database connection error", err);
      })
    } else {
      self.runHttp();
    }

  }

  /* istanbul ignore next */
  runHttp() {
    /* istanbul ignore next */
    throw new Error("Implement http method");
  }

  finishFunction(response, isAsync) {

    self.logger.log("HTTP-INFO: context function finished", "debug");

    let obj = {
      start : self.start,
      statusCode : httpStatusCode.OK,
      event : self.event,
      headers : self.event ? self.event.headers : null,
      responseObject : response,
      // path : self.queryparameters,
      queryStringParameters : self.queryparameters,
    };

    if(process.env.TEST == undefined || process.env.TEST == false || process.env.TEST == "" || process.env.TEST == "false")
      self.loggerV2.sendEs(obj, onConfig());
        
    if(!isAsync) {
      self.context.succeed(self.getApiGatewayResponse(httpStatusCode.OK, this.processId, response));
    } else {
      return self.getApiGatewayResponse(httpStatusCode.OK, this.processId, response);
    }
  }
    
  finishFunctionWithError(message, error, statusCode = httpStatusCode.INTERNAL_SERVER_ERROR, isAsync) {

    self.logger.debug("HTTP-INFO: context function finishedWithError");

    let response = error; 
        
    if ( typeof error != Boom && !(error instanceof Error)){
            
      if( !(message instanceof String)){
        message = JSON.stringify(message)
      }

      response = new Boom( message , { statusCode : statusCode } )

    }else if(!error.isBoom){
            
      response = Boom.boomify( error , { statusCode : statusCode , message : message } )

    } 

    let obj = {
      start : self.start,
      statusCode : statusCode,
      event : self.event,
      headers : self.event ? self.event.headers : null,
      responseObject : response,
      errorMessage:error.message,
      errorStack: error,            
      queryStringParameters : self.queryparameters,
    };

    if(process.env.TEST == undefined || process.env.TEST == false || process.env.TEST == "" || process.env.TEST == "false")
      self.loggerV2.sendEs(obj, onConfig());

    response.output.payload.headers = this.headers

    if(!isAsync) {
      self.context.fail(response.output.payload);
    } else {
      return {
        statusCode: statusCode,
        body: JSON.stringify(response.output.payload)
      };
    }

  }

  getApiGatewayResponse(status, processId, data) {

    return {
      "headers" : this.headers,
      "statusCode": status,
      "body": JSON.stringify(data)
    }
  }

  getAccessTokenValue(){

    if(self.event != null && self.event.headers != null) {
      if(self.event.headers["accessToken"] != null) return self.event.headers["accessToken"];
      if(self.event.headers["AccessToken"] != null) return self.event.headers["AccessToken"];
    }

    if(self.event != null && self.event.queryStringParameters != null) {
      if(self.event.queryStringParameters.accessToken != null) return self.event.queryStringParameters.accessToken;
      if(self.event.queryStringParameters.AccessToken != null) return self.event.queryStringParameters.AccessToken;
    }

    self.logger.log("Access Token not found")

    return null;

  }

  getSignatureValue() {

    if(self.event != null && self.event.queryStringParameters != null) {
      if(self.event.queryStringParameters.signature != null) return self.event.queryStringParameters.signature;
      if(self.event.queryStringParameters.Signature != null) return self.event.queryStringParameters.Signature;
    }

    self.logger.log("Signature not found")

    return null;

  }
}
module.exports = BaseHttpFunction;