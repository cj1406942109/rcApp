var config = require('../config');

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;

module.exports = new Db(config.db, new Server(config.host, config.port), { safe: true });