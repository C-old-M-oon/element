var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.port;
var app = express();
var router = express.Router();
router.get('/'), function (req, res){}