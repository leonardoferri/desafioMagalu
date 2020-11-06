'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
  _id: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    index: true
  }
});

module.exports = mongoose.models.AccessToken || mongoose.model('AccessToken', AccessTokenSchema, 'AccessToken');
