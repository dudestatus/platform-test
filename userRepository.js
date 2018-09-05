
users = {};
let autoIncrementId = 1;

/*
saves the user data into the repository, in this case an object/dictionary living in the server memory.
 */
const createUser = async (user) => {
    const newUserId = autoIncrementId++;
    const User = require('./userModel').User;
    const clone = new User(newUserId);
    clone.firstName = user.firstName;
    clone.lastName = user.lastName;
    clone.email = user.email;
    clone.password = user.password;
    clone.salt = user.salt;
    users[newUserId] = clone;
    return newUserId;
};

/*
returns the user with id userId or null if not found
 */
const getUser = async (userId) => {
    if (users[userId]) {

        const user = users[userId];
        // returning a clone to so it is not still a reference to the data in this repository.
        // The modified user can still be saved here via `updateUser`
        const User = require('./userModel').User;
        const clone = new User(userId);
        clone.firstName = user.firstName;
        clone.lastName = user.lastName;
        clone.email = user.email;
        clone.password = user.password;
        clone.salt = user.salt;
        if (user.logoutTime !== undefined) clone.logoutTime = user.logoutTime;
        return clone;
    }
    return null;
};

/*
returns the user from email or null if not found
 */
const getUserFromEmail = async (email) => {
    // The find() method returns the value of the first element in the array that satisfies the provided testing function.
    const user = Object.values(users).find(user => user.email.toLowerCase() === email.toLowerCase());
    if (user) {
        return user;
    }
    return null;
};

/*
updates user data for user with id userId
 */
const updateUser = async (userId, user) => {
    if (users[userId] === undefined) {
        throw "Error: No user to update. should probably catch this so hackers don't guess emails.";
    }
    users[userId] = user;
};

/*
deletes the user with id userId
 */
const deleteUser = async (userId) => {
    delete users[userId];
};

module.exports = {
    createUser, getUser, getUserFromEmail, updateUser, deleteUser,
};