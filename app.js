const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const sqlite3 = require('connect-sqlite3')(session);
const prisma = require('./prisma/prisma');

// Load environment variables from .env file
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passportConfig')(passport);

// Prisma Client 
prisma.$connect();

const app = express();

// Body parser
app.use(express.json());

// Initialize logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new sqlite3({
        db: './db/sessions.sqlite3',
        concurrentDB: true
    }), 
    cookie: {
        maxAge: 3600000 // 1 hour
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/advice', require('./routes/advice')); 
app.use('/api/quote', require('./routes/quote'));

// Add top level error handler
app.use(function(err, req, res, next) {

    console.error(`Error: ${err.message}`);
    if (err.message === 'UserNotFoundError') {
        res.status(401).json({ message: err.message });
    }
    
    // res.status(500).json({ message: 'Something went wrong' });

});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));