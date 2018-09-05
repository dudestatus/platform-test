const {Client} = require('pg');

const getClient = () => {
    return new Client({
        user: process.env.PLATFORM_TEST_DB_USER || process.env.USER,
        host: process.env.PLATFORM_TEST_DB_HOST || 'localhost',
        database: process.env.PLATFORM_TEST_DB || 'auth',
        password: process.env.PLATFORM_TEST_DB_PASS || null,
        port: process.env.PLATFORM_TEST_DB_PORT || 5432,
    });
};

/*
saves the user data into the repository, in this case an object/dictionary living in the server memory.
 */
const createUser = async (user) => {
    const insertQuery = {
        text: `INSERT INTO users(
            first_name,
            last_name,
            email,
            password,
            salt
        ) VALUES(
            $1,
            $2,
            $3,
            $4,
            $5
        ) RETURNING *`,
        values: [
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            user.salt,
        ],
    };

    const client = getClient();
    await client.connect();

    const res = await client.query(insertQuery);
    const newId = res.rows[0].id;
    client.end();
    return newId;
};

/*
returns the user with id userId or null if not found
 */
const getUser = async (userId) => {


    const client = getClient();
    await client.connect();
    const res = await client.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    client.end();
    if (res.rows.length > 0) {
        return getUserModelFromDBData(res.rows[0]);
    }
    return null;
};

/*
returns the user from email or null if not found
 */
const getUserFromEmail = async (email) => {

    const client = getClient();
    await client.connect();
    const res = await client.query("SELECT * FROM users WHERE email=$1", [email]);
    client.end();
    if (res.rows.length > 0) {
        return getUserModelFromDBData(res.rows[0]);
    }
    return null;
};

const getUserModelFromDBData = (userRow) => {
    const User = require('./userModel').User;
    const clone = new User(userRow.id);
    clone.firstName = userRow.first_name;
    clone.lastName = userRow.last_name;
    clone.email = userRow.email;
    clone.password = userRow.password;
    clone.salt = userRow.salt;
    if (userRow.logout_time !== null) clone.logoutTime = new Date(userRow.logout_time);
    return clone;
};

/*
updates user data for user with id userId
 */
const updateUser = async (userId, user) => {

    const client = getClient();
    await client.connect();
    const res = await client.query(`UPDATE users SET (
            first_name,
            last_name,
            email,
            password,
            salt,
            logout_time
        ) = (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        ) WHERE id=$7`, [
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            user.salt,
            user.logoutTime || null,
            user.id,
        ]
    );
    client.end();

    if (res.rowCount < 1) {
        throw "Error: No user to update. should probably catch this so hackers don't guess emails.";
    }
};

/*
deletes the user with id userId
 */
const deleteUser = async (userId) => {
    const client = getClient();
    await client.connect();
    await client.query(`DELETE * FROM users WHERE id=$1`, [userId]);
    client.end();
};

module.exports = {
    createUser, getUser, getUserFromEmail, updateUser, deleteUser,
};