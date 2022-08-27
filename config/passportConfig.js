const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const prisma = require('../prisma/prisma');
const { validateEmail } = require('../helpers/validators');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        }, 
        async function verify(email, password, done) {
            try {

                // Validating email
                if (!validateEmail(email)) {
                    return done(Error('EmailValidationError'), false);
                }

                // Finding user in the database
                const user = await prisma.user.findFirst({ where: { email } });

                // Checking if user exists
                if (!user) {
                    return done(Error('UserNotFoundError'), false);
                }

                // Computing hash of the password using the user's salt
                const passwdHash = crypto.pbkdf2Sync(password.toString(), user.salt, 100000, 64, 'sha512').toString('hex');
                
                // Comparing password hashes
                if (passwdHash !== user.password) {
                    return done(Error('IncorrectPasswordError'), false);
                }
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
        
    passport.serializeUser(function(user, done) {
        process.nextTick(() => {
            return done(null, {
                id: user.id,
                name: user.name,
                email: user.email,
            
            });
        })
    }),

    passport.deserializeUser(function(user, done) {
        process.nextTick(() => {
            return done(null, user);
        });
    });
};