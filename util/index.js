module.exports = {

    //COMMONS
    BaseFunction: require("./common/baseFunction"),
    BaseHttpFunction: require("./common/baseHttpFunction"),

    //HELPERS
    Logger: require("./helpers/logger"),
    EsLogger: require('./helpers/esLogger'),
    LoggerHandler: require('./helpers/loggerHandler'),
    Utility: require("./helpers/utility"),
    Cache: require('./helpers/cache'),
    ResponseHandler: require('./helpers/responseHandler'),

    //SERVICES
    TokenLogin: require("./services/tokenLogin"),
    AWS: require("./services/aws"),
    Authorizer: require("./services/authorizer"),
    QaData: require("./services/qadata"),

    //PLUGINS
    Authorizing: require("./plugins/authorizing"),
    HealthCheck: require('./plugins/healthCheck'),
    HealthCheckCore: require('./plugins/healthCheckCore'),
};
