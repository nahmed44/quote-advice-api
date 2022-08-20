const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const prisma = require('../prisma/prisma');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        }, 
        async function verify(email, password, done) {
            try {
                const user = await prisma.user.findFirst({ where: { email } });

                console.log(`user: ${user}`);

                if (!user) {
                    return done(Error('UserNotFoundError'), false);
                }

                const passwdHash = crypto.pbkdf2Sync(password.toString(), user.salt, 100000, 64, 'sha512').toString('hex');

                if (passwdHash !== user.password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                
                return done(null, user);
            } catch (error) {
                console.debug(error);
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