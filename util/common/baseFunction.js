const mongoose = require("mongoose");
const logger = require("../helpers/logger-deprecated");
const loggerV2 = require("../helpers/logger");
const uuidv1 = require("uuid/v1");

let self;
class BaseFunction {

  constructor(event, context, callback) {

    this.context = context;
    this.event = event;
    this.callback = callback;
    this.isDatabaseConnected = false;
    this.logger = logger;
    this.loggerV2 = loggerV2;

    if (this.event != null && this.event.contextProperties != null) {
      this.contextProperties = this.event.contextProperties;
    } else {
      this.contextProperties = {};
      this.addContextProperty("processId", uuidv1());
    }
    self = this
    logger.setContextProperties(this.contextProperties);

  }

  addContextProperty(property, value) {
    if ((typeof value) == "string") {
      eval("this.contextProperties." + property + "='" + value + "'");
    } else {
      eval("this.contextProperties." + property + "=" + value);
    }
  }

  connectDB() {

    logger.log("connecting to database using mongoose driver");

    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI).then(function () {
        logger.log("database connected");
        self.isDatabaseConnected = true;
        return resolve();
      }).catch(function (err) {
        logger.error("could not connect to database", err);
        self.isDatabaseConnected = false;
        return reject(err);
      });
    });
  }

  httplog(statusCode, queryparameters, event, start, resBody) {
    logger.httplog(statusCode, queryparameters, event, start, resBody);
  }

  /* istanbul ignore next */
  run() {
    /* istanbul ignore next */
    throw new Error('You have to implement the method doSomething! ');
  }

  finish(error, result) {

    if (result != null && this.contextProperties != null) {
      result.contextProperties = this.contextProperties;
    }

    this.closeDBConnection();

    this.finishFunction(error, result);

  }

  closeDBConnection() {

    if (this.isDatabaseConnected) {
      mongoose.connection.close(function (result) {
        let message = result || 'Database disconnected successfully';
        logger.log(message);
        self.isDatabaseConnected = false;
      });
    }
  }

  finishFunction(error, result) {
    if (error != null) {
      logger.error("Error", error)
    }
    logger.debug("function finished");

    this.callback(error, result);
  }

}

module.exports = BaseFunction;
