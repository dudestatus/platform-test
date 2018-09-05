const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// todo add business logic only layer to decouple this from the express-js req, res, next params

// this can be overwritten in tests to be the mock implementation w/ js frameworks
const User = require('./userModel').User;

const getHash = (password, salt) => crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

const TOKEN_SECRET = 'ae90cdf1ce598855';

const TOKEN_USER_ID_FIELD = 'userId';
const TOKEN_ISSUED_AT_FIELD = 'iat';

const AUTH_ERROR = "invalid credentials";
const PASS_MATCH_ERROR = "passwords must match";
const PASS_REQUIREMENTS_ERROR = "password does not meet requirements. must be 8 characters long.";

/*
returns User instance for the user matching the token, or throws an exception with message AUTH_ERROR
 */
const getUserFromToken = async token => {
    const tokenPayload = jwt.verify(token, TOKEN_SECRET);

    const user = await User.getFromId(tokenPayload[TOKEN_USER_ID_FIELD]);

    if (user === null) {
        console.warn(`User not found`);  // todo remove logging
        throw AUTH_ERROR;

    } else if (user.logoutTime !== undefined && tokenPayload[TOKEN_ISSUED_AT_FIELD] < user.logoutTime) {
        console.warn(`User ${user.email} has expired this token`);
        throw AUTH_ERROR;
    }
    return user;
};

/**
 * createUser -- If provided values are valid, creates and saves a new user with them.
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} password
 * @param {string} confirmPassword
 * @param {string} email
 * @returns {Promise}
 */
const createUser = async (firstName, lastName, password, confirmPassword, email) => {

    // validate
    if (password !== confirmPassword) {
        throw PASS_MATCH_ERROR;
    }

    // todo better password constraints
    if (password.length < 8) {
        throw PASS_REQUIREMENTS_ERROR;
    }

    if (await User.getFromEmail(email.toLowerCase()) !== null) {
        // better to pretend to have a successful response to make it harder for users could mine emails
        console.warn(`Attempt to create existing user ${email}`);
        return;
    }

    /// make a 40 bit salt hex string
    const salt = crypto.randomBytes(5).toString('hex');
    const hash = getHash(password, salt);

    const user = new User();
    user.firstName = firstName;
    user.lastName  = lastName;
    user.password = hash;
    user.salt = salt;

    user.email = email;

    return user.save();
};

/**
 * login -- If provided values authenticate a user, then return a new login token for the user.
 * @param {string} email
 * @param {string} password
 * @returns {string}
 */
const login = async (email, password) => {
    const user = await User.getFromEmail(email.toLowerCase());

    if (user === null) {
        throw AUTH_ERROR;
    }

    const testHash = getHash(password, user.salt);

    if (testHash !== user.password) {
        throw AUTH_ERROR;
    }

    // active for one hour (defined below), or until user signs out (see logic in getUserFromToken function above)
    return jwt.sign({[TOKEN_USER_ID_FIELD]: user.id}, TOKEN_SECRET, {expiresIn: '1h', algorithm: 'HS256'});
};

/**
 * updateUser -- given a user was retrieved with the provided token, update the user info with the provided values and save the user.
 * @param {string} token
 * @param {string} firstName
 * @param {string} lastName
 * @returns {Promise}
 */
const updateUser = async (token, firstName, lastName, email) => {

    const user = await getUserFromToken(token);

    // better to be explicit about what gets updated,
    // but in the future if there are more things that need to be updated, it might be nice to define the user schema in json and pass an expected object
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    return user.save();
};

/**
 * logoutUser -- given a user was retrieved with the provided token, log the user out by setting user prop logoutTime to the current time.
 * No tokens will be accepted if created before the user logoutTime; see getUserFromToken function above.
 * @param {string} token
 * @returns {Promise}
 */
const logoutUser = async (token) => {
    const user = await getUserFromToken(token);

    user.logoutTime = Math.floor(Date.now() / 1000);
    return user.save();
};

/**
 * deleteUser -- given a user was retrieved with the provided token, delete the user
 * @param {string} token
 * @returns {Promise}
 */
const deleteUser = async (token) => {
    const user = await getUserFromToken(token);

    return user.delete();
};


module.exports = {createUser, login, updateUser, logoutUser, deleteUser};