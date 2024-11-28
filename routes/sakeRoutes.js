const express = require('express');
const router = express.Router();
const { getAllSake, getSakeByName } = require('../controllers/sakeController');

router.get('/', getAllSake);
router.get('/:name', getSakeByName);

module.exports = router;