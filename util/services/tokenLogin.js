module.exports = class TokenLogin {
  static getToken(token, signature) {
    return new Promise(function (resolve) {
      const AccessToken = require('../common/accessTokenSchema');
      AccessToken.findOne({ '_id': token }, function (err, accessToken) {
        if (accessToken != null && accessToken.userId != null) {
          return resolve(signature);
        }
      });
    })
  }
}
