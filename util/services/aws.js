const util = require("util");
const AWS = require("aws-sdk");
const logger = require("../helpers/logger-deprecated");
const _ = require("underscore");

let envArray = [];
let getRet;

const getLastPathString = (path) => {
  let pathArray = path.split('/');
  return (pathArray[pathArray.length -1]).toUpperCase();
}

const execSsmRequest = async (params) => {

  getRet = await getParametersByPath(params);
  while (getRet.data.NextToken) {
    params['NextToken'] = getRet.data.NextToken;
    getRet = await getParametersByPath(params);
  }

  return envArray;
}

const getParametersByPath = async(params) => {
  let ssm = new AWS.SSM({ apiVersion: '2018-09-12', region: 'sa-east-1' });
  return new Promise((resolve, reject) => ssm.getParametersByPath((params), (err, data) => {
    if (err) {
      return reject(err);
    }

    data.Parameters.forEach(function(element) {
      envArray.push(element);
    }, this);

    return resolve({ data,envArray });
  }));
}

module.exports = class AmazonService {

  static sendQueue(value, arg_prefix) {
    let self = this;

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    logger.log(util.format("Calling queue %s", value), "debug");

    let params = {
      MessageBody: JSON.stringify(value),
      QueueUrl: ""
    };

    return new Promise(function (resolve, reject) {
      self.findOrCreateQueue(arg_prefix)
        .then((result) => {

          params.QueueUrl = result.QueueUrl;
          selfSqs.sendMessage(params, function (err, data) {
            if (err) {
              logger.error("Calling sendMessage Queue", err);
              return reject(err);
            } else {
              return resolve(data);
            }
          });
        })
        .catch((err) => {
          logger.error("Calling findOrCreateQueue Queue", err);
          return reject(err);
        })
    });
  }

  static sendQueueBatch(value, url) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    let selfSqs = new AWS.SQS({ region: process.env.REGION });
    let params = { Entries: value, QueueUrl: url };

    return new Promise(function (resolve, reject) {

      selfSqs.sendMessageBatch(params, function (err, data) {
        if (err) {
          logger.error("Calling sendMessageBatch Queue", err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });

    });

  }

  static deleteItemQueue(receiptHandle, queue_url) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    logger.log("Calling external Queue", "debug");

    if (receiptHandle == null) {
      return Promise.reject(new Error('You must fill all fields'));
    }

    logger.log(util.format("Calling queue %s", queue_url), "debug");

    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    let params = {
      ReceiptHandle: receiptHandle,
      QueueUrl: queue_url
    };

    return new Promise(function (resolve, reject) {

      selfSqs.deleteMessage(params, function (err, data) {
        if (err) {
          logger.error("calling deleteItemQueue error: ", err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });

  }

  //Quando query=true não há reserva de item da fila
  //Quando a intenção é somente pesquisar e não reservar item passar true
  static getItemQueue(queue_url, query) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    logger.log("Calling external Queue", "debug");

    if (queue_url == null) {
      return Promise.reject(new Error('You must fill all fields'));
    }

    logger.log(util.format("Calling queue %s", queue_url), "debug");

    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    const params = {
      QueueUrl: queue_url
    };

    if (query) {
      params.VisibilityTimeout = 0;
    }

    return new Promise(function (resolve, reject) {

      selfSqs.receiveMessage(params, function (err, data) {
        if (err) {
          logger.error("getItemQueue error: ", err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });

  }

  static getQueueAttributes(queue_url) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    logger.log("Calling external Queue", "debug");

    if (queue_url == null) {
      return Promise.reject(new Error('You must fill all fields'));
    }

    logger.log(util.format("Calling queue %s", queue_url), "debug");

    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    var params = {
      QueueUrl: queue_url,
      AttributeNames: ["All"]
    };

    return new Promise(function (resolve, reject) {

      selfSqs.getQueueAttributes(params, function (err, data) {
        if (err) {
          logger.error("getItemQueue error: ", err);
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });

  }

  static callRemoteFunction(arn, args) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    let lambda = new AWS.Lambda({
      apiVersion: '2015-03-31',
      region: process.env.REGION
    });

    logger.log(util.format("Calling remote function %s", arn), "debug");

    if (args == null) args = {};
    args.processId = this.processId;

    let params = {
      FunctionName: arn,
      InvocationType: 'Event',
      Payload: JSON.stringify(args)
    };

    return new Promise(function (resolve, reject) {
      lambda.invoke(params, function (err, data) {
        if (err) {
          logger.error("Calling callRemoteFunction error: ", err);
          return reject(err.stack);
        }
        else {
          logger.log("Calling callRemoteFunction success: " + data);
          return resolve(data);
        }
      });
    });

  }

  static callStepFuncion(arn, lambda) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    let stepFuncion = new AWS.StepFunctions({ region: process.env.REGION });
    logger.log(util.format("Calling step function %s", arn), "debug");

    let params = {
      stateMachineArn: arn,
      input: JSON.stringify({
        contextProperties: lambda.contextProperties
      })
    };

    return new Promise(function (resolve, reject) {
      stepFuncion.startExecution(params, function (err, data) {
        if (err) {
          logger.error(util.format("Calling stepFuncions.startExecution function %s error", params.stateMachineArn), err);
          return reject(err);
        }
        let response = {
          statusCode: 200,
          body: JSON.stringify({ "message": "started state machine" }),
          result: data
        };
        return resolve(null, response);
      });
    });

  }

  static findOrCreateQueue(arg_prefix) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    if (arg_prefix == null) {
      logger.log(util.format("Parameter is must %s", arg_prefix), "debug");
      return;
    }

    let selfSqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: process.env.REGION
    });

    logger.log(util.format("Calling findOrCreateQueue: %s", arg_prefix), "debug");

    var params = {
      QueueName: util.format("%s_%s_%s", arg_prefix, process.env.SUFIXQUEUE, process.env.STAGE),
      Attributes: {}
    };

    return new Promise(function (resolve, reject) {

      if (selfSqs == null && selfSqs.createQueue != null) {
        return reject("Obj SQS Amazon nulo");
      } else {
        selfSqs.createQueue(params, function (err, data) {
          if (err) {
            logger.error(util.format("Calling createQueue function: %s", params), err);
            return reject("Error calling createQueue: " + err);
          } else {
            logger.log("createQueue success " + data.QueueUrl);
            return resolve(data);
          }
        });
      }

    });

  }

  static stopStepFuncion(arn) {

    AWS.config.apiVersions = {
      stepfunctions: '2016-11-23',
      // other service API versions
    };
    let stepFuncion = new AWS.StepFunctions();

    logger.log(util.format("Calling Stop step function %s", arn), "debug");

    var params = {
      executionArn: arn
    };

    return new Promise(function (resolve, reject) {
      stepFuncion.stopExecution(params, function (err) {
        if (err) {
          logger.error(util.format("Calling stepFuncions.stopExecution function %s error %s", params.executionArn, "error"), err);
          return reject(err);
        }
        logger.log(util.format("Calling stepFuncions.stopExecution success %s", params.executionArn), "debug");
        return resolve();
      });
    });
  }

  static s3PutObjectInBatch(data) {

    const s3 = new AWS.S3({ apiVersion: '2017-06-23' });
    var promises = [];
    var itens = [];
    logger.log("init s3PutObjectInBatch")
    return new Promise(function (resolve) {

      while (promises.length < process.env.BATCH_SIZE_S3 && _.size(data) > 0) {

        let item = data.pop();
        var params = {
          Body: item.buffer,
          Bucket: item.BucketToSend, //util.format("%s/%s",process.env.S3_DIGITAL_BUCKET, item.bucket),
          Key: item.nameImage,
          ContentType: item.ContentTypeImage
        };
        promises.push(new Promise(function (resolve) {
          s3.putObject(params, function (err) {
            if (err) {
              item.status = "error"
              logger.log("error s3PutObjectInBatch", err);
            } else {
              item.status = "success"
            }
            logger.log("push s3PutObjectInBatch");
            itens.push(item);
            return resolve();
          });
        }));
      }

      return Promise.all(promises).then(function () {
        logger.log("end s3PutObjectInBatch")
        return resolve(itens);
      })
    })
  }

  static s3PutObject(file, bucket) {
    const s3 = new AWS.S3({ apiVersion: '2017-06-23' });

    return new Promise(function (resolve, reject) {

      var params = {
        Body: file.content,
        Bucket: bucket,
        Key: file.name,
        ContentType: file.ContentType
      };

      if (file.ContentEncoding) {
        params.ContentEncoding = file.ContentEncoding;
      }

      s3.putObject(params, function (err, data) {
        if (err)
          return reject(err);

        return resolve(data);
      });
    })
  }


  static canCallAmazonFunction() {
    return (process.env.REGION != null && (
      process.env.REGION == "us-east-1" ||
      process.env.REGION == "us-east-2" ||
      process.env.REGION == "sa-east-1"
    ));
  }

  static sendMail(emaillist, subject, body) {

    let eParams = {
      Destination: {
        ToAddresses: emaillist
      },
      Message: {
        Body: {
          Html: {
            Data: body
          }
        },
        Subject: {
          Data: subject + ": " + process.env.STAGE
        }
      },
      Source: "leoferriteste@gmail.com"
    };

    logger.log('===SENDING EMAIL===', "debug");

    return new Promise(function (resolve, reject) {
      const region = process.env.REGION_SES || 'us-east-1';
      const ses = new AWS.SES({ region });
      ses.sendEmail(eParams, function (err, data) {
        if (err) {
          logger.error(util.format("Sending email  %s error %s", emaillist, "error"), err);
          return reject(err);
        }
        else {
          logger.log("===EMAIL SENT===", "debug");
          logger.log(JSON.stringify(data), "debug");


          logger.log("EMAIL CODE END", "debug");
          logger.log('EMAIL: ', JSON.stringify(emaillist), "debug");
          return resolve(null, data);
        }
      });

    });
  }

  static sendMailRaw(destinationsEmail, sourceEmail, subject, body, attachment, fileName, contentType) {

    let sesRegion = new AWS.SES({ region: 'us-east-1' });

    var ses_mail = "";
    ses_mail += "Subject: " + subject + "\n";
    ses_mail += "MIME-Version: 1.0\n";
    ses_mail += "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail += "--NextPart\n";
    ses_mail += "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail += body + "\n\n";

    if (attachment != undefined && attachment != null &&
      fileName != undefined && fileName != null &&
      contentType != undefined && contentType != null) {
      ses_mail += "--NextPart\n";
      ses_mail += "Content-Type: " + contentType + "; \n";
      ses_mail += "Content-Disposition: attachment; filename=\"" + fileName + "\"\n";
      ses_mail += "Content-Transfer-Encoding: base64\n\n"
      ses_mail += attachment;
    }

    ses_mail += "--NextPart--";

    let eParams = {
      RawMessage: { Data: new Buffer(ses_mail) },
      Destinations: destinationsEmail,
      Source: sourceEmail
    };

    logger.log('===SENDING EMAIL ===', "debug");

    return new Promise(function (resolve, reject) {
      sesRegion.sendRawEmail(eParams, function (err, data) {
        if (err) {
          return reject(err);
        } else {
          console.log("===EMAIL SENT===", "debug");
          return resolve(data);
        }
      });
    });
  }

  static purgeQueue(queue_url) {

    if (!this.canCallAmazonFunction()) return Promise.resolve("Local does not call Amazon");

    logger.log("Calling external Queue", "debug");

    if (queue_url == null) {
      return Promise.reject(new Error('You must fill all queue url'));
    }

    logger.log(util.format("Calling queue %s", queue_url), "debug");

    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    var params = {
      QueueUrl: queue_url
    };

    return new Promise(function (resolve, reject) {

      selfSqs.purgeQueue(params, function (err, data) {
        if (err) {
          logger.error("calling purge queue error: ", err);
          return reject(err);
        } else {
          return resolve(null, data);
        }
      });
    });

  }

  static getDetailQueue(arn) {
    AWS.config.apiVersions = {
      stepfunctions: '2016-11-23',
      // other service API versions
    };
    let selfSqs = new AWS.SQS({
      region: process.env.REGION
    });

    logger.log(util.format("Get Deatil Queue %s", arn), "debug");

    var params = {
      QueueUrl: arn,
      AttributeNames: ["All"]
    };

    return new Promise(function (resolve, reject) {
      selfSqs.getQueueAttributes(params, function (err, data) {
        if (err) {
          logger.error(util.format("Deatil Queue function %s error %s", params.QueueUrl, "error"), err);
          return reject(err);
        }
        logger.log(util.format("Deatil Queue success %s", params.QueueUrl), "debug");
        return resolve(data);
      });
    });
  }

  static refreshAllParameterStoreByPath(parameterPath) {

    let params = {
      Path: parameterPath,
      Recursive: true,
      // with_decryption: true
    };

    let envArray = [];

    return new Promise(function (resolve, reject) {
      execSsmRequest(params, envArray)
        .then((result) => {
          if (result) {
            result.forEach(function (element) {
              let trimPath = element.Name.replace(params.Path, '');
              let keyString = getLastPathString(trimPath);
              process.env[keyString] = element.Value;
            }, this);
          }
          // return resolve(`'--Environments updated: ${result.length}`);

          return resolve({
            status: 'OK',
            message: `'--Environments updated: ${result.length}`
          });

        })
        .catch((err) => {
          return reject(err);
        })
    });
  }

}

module.exports.Rekognition = class AmazonService {
  async detectText(bucket, imageName) {

    let response;
    let params = {
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: imageName,
        },
      }
    };

    try {
      let rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27', region: process.env.REKOGNITION_AWS_REGION });
      let detectText = await rekognition.detectText(params).promise();
      response = detectText.TextDetections.map((t) => { return t.DetectedText });
    }
    catch (err) {
      logger.error(util.format("Rekognition.detectText function %s error %s", err));
      throw err
    }
    return response;
  }
}
