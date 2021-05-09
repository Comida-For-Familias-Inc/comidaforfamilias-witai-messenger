var express = require('express');
var router = express.Router();
var userController= require('../controllers/fetch-controller');

router.post('/fetch-data',fetchController.fetchData);

module.exports = router;