const express = require('express');

const app = express();

// Routes
app.use('/', require('./routes/index'));
app.use('/api/advice', require('./routes/advice')); 
app.use('/api/quote', require('./routes/quote'));