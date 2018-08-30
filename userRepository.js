
users = {};
let autoIncrementId = 1;

/*
saves the user data into the repository, in this case an object/dictionary living in the server memory.
 */
const createUser = (user) => {
    const newUserId = autoIncrementId++;
    users[newUserId] = user;
    return newUserId;
};

/*
returns the user with id userId or null if not found
 */
const getUser = (userId) => {
    if (users[userId]) {
        return users[userId]; // todo make new object so when this is modified on the outside it doesn't affect the repository
    }
    return null;
};

/*
returns the user from email or null if not found
 */
const getUserFromEmail = (email) => {
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
const updateUser = (userId, user) => {
    if (users[userId] === undefined) {
        throw "Error: No user to update. should probably catch this so hackers don't guess emails.";
    }
    users[userId] = user;
};

/*
deletes the user with id userId
 */
const deleteUser = (userId) => {
    delete users[userId];
};

module.exports = {
    createUser, getUser, getUserFromEmail, updateUser, deleteUser,
};