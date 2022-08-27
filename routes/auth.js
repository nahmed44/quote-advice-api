const crypto = require('crypto');
const passport = require('passport');
const router = require('express').Router();
const prisma   = require('../prisma/prisma');
const { validateEmail } = require('../helpers/validators');
const { formatErrorResponse, formatDataResponse } = require('../helpers/formatResponse');

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
                const jsonErrorResponse = formatErrorResponse({
                    errName : 'NameRequiredError',
                    errMessage: 'Name is required',
                    statusCode: 400,
                    message: 'Name is required'
                });
                return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
            }
            if(!email) {
                const jsonErrorResponse = formatErrorResponse({
                    errName : 'EmailRequiredError',
                    errMessage: 'Email is required',
                    statusCode: 400,
                    message: 'Email is required'
                });
                return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
            }
            if(!password) {
                const jsonErrorResponse = formatErrorResponse({
                    errName : 'PasswordRequiredError',
                    errMessage: 'Password is required',
                    statusCode: 400,
                    message: 'Password is required'
                });
                return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
            }
        }

        // Checking if user email is valid
        if (!validateEmail(email)) {
            const jsonErrorResponse = formatErrorResponse({
                errName : 'EmailInvalidError',
                errMessage: 'Email is invalid',
                statusCode: 400,
                message: 'Please provide a valid email'
            });
            return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
        }

        // Checking if user password is valid
        if (password.toString().length < 10) {
            const jsonErrorResponse = formatErrorResponse({
                errName : 'PasswordLengthError',
                errMessage: 'Password does not meet the minimum length requirement',
                statusCode: 400,
                message: 'Password must be at least 10 characters long'
            });
            return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
        }

        // Checking if user already exists in the database (email)
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            const jsonErrorResponse = formatErrorResponse({
                errName : 'UserAlreadyExistsError',
                errMessage: 'User already exists',
                statusCode: 400,
                message: 'User already exists'
            });
            return res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
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
            const jsonSuccessResponse = formatDataResponse({
                count: 1,
                statusCode: 201,
                message: 'User successfully registered',
                data: [{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }]
            });

            res.status(jsonSuccessResponse.statusCode).json(jsonSuccessResponse);
        }).catch(error => {
            console.log(error);
            const jsonErrorResponse = formatErrorResponse({
                errName : 'UserRegistrationError',
                errMessage: 'Server ran into an error while registering the user',
                statusCode: 500,
                message: 'Encountered an error while registering user. Please try again later.'
            });
            res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
        });
    } catch (error) {
        console.log(error);
        const jsonErrorResponse = formatErrorResponse({
            errName : 'UserRegistrationError',
            errMessage: 'Server ran into an error while registering the user',
            statusCode: 500,
            message: 'Encountered an error while registering user. Please try again later.'
        });
        res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
    }
    
});

// @desc    Logout user
// @route   POST /api/auth/logout
router.post('/logout', (req, res, next) => {
    req.logout({ keepSessionInfo: false }, 
        (err) => {
            if (err) { return next(err); }
            res.status(200).json({ message: 'You have been successfully logged out!' });
        }
    );
});


module.exports = router;

