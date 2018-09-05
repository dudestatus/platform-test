
// used in the userModel data operations, decouples the model with the db implementation
const userRepository = require('./userRepositoryPostgreSQL');


class User {
    constructor(id = null) {

        // no set method for id to help prevent accidental duplications of data
        if (id) {
            this._id = id;
        }
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = String(value);
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = String(value);
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = String(value);
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = String(value);
    }

    get salt() {
        return this._salt;
    }

    set salt(value) {
        this._salt = String(value);
    }

    get id() {
        return this._id;
    }

    get logoutTime() {
        return this._logoutTime;
    }

    set logoutTime(value) {
        this._logoutTime = Number(value);
    }

    /**
     * throws exception on validation
     */
    async save() {
        this.validate();

        if (!this.id) {
            return userRepository.createUser(this);
        } else {
            return userRepository.updateUser(this.id, this);
        }
    }

    // going to do this operation for simplicity, but usually a bad idea to delete since there may database be references to the user
    // you could do a cascade operation, but that only removes references in this db, and userId may be referenced in the separate analytics platform etc.
    async delete() {
        return userRepository.deleteUser(this.id);
    }

    static async getFromId(id) {
        return userRepository.getUser(id);
    }

    static async getFromEmail(email) {
        return userRepository.getUserFromEmail(email)
    }

    // doing validation on save here instead of property set
    // this is so the app isn't as fragile when populating these on database reads
    validate() {
        if (this.firstName === undefined || this.firstName.length < 1)
            throw "firstName validation error";
        if (this.lastName === undefined || this.lastName.length < 1)
            throw "lastName validation error";
        if (this.email === undefined || this.email.length < 1)
            throw "email validation error";
        if (this.password === undefined || this.password.length < 1)
            throw "password validation error";
        if (this.salt === undefined || this.salt.length < 1)
            throw "salt validation error";
        if (this.id !== undefined && !this.id || this.id < 0)
            throw "id validation error";
        if (this.logoutTime !== undefined && this.logoutTime <= 0) {
            throw "logout time validation error";
        }

    }

}

module.exports.User = User;
