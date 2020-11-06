const utility = require("../helpers/utility")
let instance;
let pjson = require('../../package.json');

function printMessage(msg, data, level, type) {

  let stack = getStack()

  let message = {
    date: utility.now(),
    type: type,
    message: msg,
    file: formatFilePath(stack[2].getFileName()) + ":" + stack[2].getLineNumber(),
    functionName: stack[2].getFunctionName(),
    level: level,
    contextProperties: instance.contextProperties,
  }

  if (data) {
    message.data = JSON.stringify(data)
  }

  if (process.env.TEST != null && process.env.TEST != undefined) {
    if (!(process.env.TEST === true || (process.env.TEST + "").toLowerCase() === "true")) {
      /* istanbul ignore next */
      console.log(message);
    }
  }
  else {
    /* istanbul ignore next */
    console.log(message);
  }

}

class Logger {

  constructor() {
    this.processId = "";
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  setContextProperties(contextProperties) {
    this.contextProperties = contextProperties;
  }

  httplog(statusCode, queryparameters, event, start, resBody) {

    let self = this;

    try {

      let method = "";
      let userAgent = "";
      let consumerIp = "";
      let consumerKey = "";
      let resLength = 0;

      if (resBody != null) {
        if (typeof resBody !== "string") {
          try {
            resBody = JSON.stringify(resBody);
          } catch (error) {
            /* istanbul ignore next */
            resBody = "";
          }
        }
        resLength = Buffer.byteLength(resBody);
      }

      if (resBody == null || statusCode == 200) {
        resBody = {};
      }

      if (event) {

        method = event.httpMethod != null ? event.httpMethod : "";

        if (event.headers != null) {
          userAgent = event.headers["User-Agent"] != null ? event.headers["User-Agent"] : "";
          consumerKey = event.headers["X-API-KEY"] != null ? event.headers["X-API-KEY"] : "";
        }

        if (event.requestContext != null && event.requestContext.identity != null && event.requestContext.identity.sourceIp != null) {
          consumerIp = event.requestContext.identity.sourceIp;
        }

      } else {
        event = {}
      }

      let logObj = {
        contextProperties: self.contextProperties,
        type: "httpLog",
        httpLog: true,
        date: start,
        duration: new Date - start,
        method: method,
        statusCode: statusCode,
        path: event.path != null ? event.path : "",
        body: event.body != null ? event.body : "",
        resLength: resLength,
        resBody: resBody,
        query: queryparameters != null ? queryparameters : "",
        userAgent: userAgent,
        consumerKey: consumerKey,
        consumerIp: consumerIp
      };

      if (event.customerId != null) {
        logObj.customerId = event.customerId;
      }

      if (event.dataOrigin != null && event.cached != null) {
        logObj.dataOrigin = event.dataOrigin;
        logObj.cached = event.cached;
      }

      if (event.warmup) {
        logObj.warmup = event.warmup;
      }

      if (event.coldStart) {
        logObj.coldStart = event.coldStart;
      }

      /* istanbul ignore next */
      if (process.env.TEST != null && process.env.TEST != undefined) {
        if (!(process.env.TEST === true || (process.env.TEST + "").toLowerCase() === "true")) {
          /* istanbul ignore next */
          self.log("httpLog", logObj);
        }
      }
      else {
        /* istanbul ignore next */
        self.log("httpLog", logObj);
      }
    }
    catch (e) {
      this.error("HTTP-ERROR: error on generate log ", e);
    }

  }

  log(message, data, type = "generic") {
    printMessage(message, data, "Log", type);
  }
  trace(message, data, type = "generic") {
    printMessage(message, data, "Trace", type);
  }

  debug(message, data, type = "generic") {
    printMessage(message, data, "Debug", type);
  }

  info(message, data, type = "generic") {
    printMessage(message, data, "Info", type);
  }

  warn(message, data, type = "generic") {
    printMessage(message, data, type);
  }

  error(message, data, type = "generic") {

    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    printMessage(message, data, "Error", type);
  }

}

function getStack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) { return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}


function formatFilePath(filePath) {
  if (!filePath) {
    return ""
  }
  var res = filePath.substr(0, filePath.indexOf(pjson.name));
  filePath = filePath.replace(res, "");
  return filePath
}

module.exports = new Logger();
