const express = require('express');
const router = express.Router();
const Advice = require('../models/Advice');
const Quote = require('../models/Quote');

// @desc    Get a random advice
// @route   GET /api/advice
router.get('/', (req, res) => {

});


// @desc    Get a advice for the given ID
// @route   GET /api/advice/:id
router.get('/:id', (req, res) => {

});

// @desc    Create a advice
// @route   POST /api/advice
router.post('/', (req, res) => {

});

module.exports = router;