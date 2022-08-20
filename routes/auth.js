const crypto = require('crypto');
const passport = require('passport');
const router = require('express').Router();
const prisma   = require('../prisma/prisma');

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', passport.authenticate('local', { failureMessage: 'Invalid email or password.',  }), 
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            message: 'You have been successfully logged in!'
        });
    }
);


// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if user has provided all the required fields
        if (!name || !email || !password) {
            if(!name) {
                return res.status(400).json({ message: 'Please provide a name' });
            }
            if(!email) {
                return res.status(400).json({ message: 'Please provide an email' });
            }
            if(!password) {
                return res.status(400).json({ message: 'Please provide a password' });
            }
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        // Checking if user email is valid
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        // Checking if user password is valid
        if (password.toString().length < 10) {
            return res.status(400).json({ message: 'Please provide a password with at least 10 characters' });
        }

        // Checking if user already exists in the database (email)
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password.toString(), salt, 100000, 64, 'sha512').toString('hex');

        prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hash,
                salt: salt
            }
        })
        .then(user => {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                message: 'You have been successfully registered!'
            });
        }).catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Encountered an error while registering user. Please try again later.'
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server ran into an error! Please try again later.'
        });
    }
    
});

// @desc    Logout user
// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'You have been successfully logged out!' });
});


module.exports = router;

