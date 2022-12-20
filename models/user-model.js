const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String },
    image: {
        type: String,
        required: false,
        default: "/img/user-avatar.png"
    },
    bio: {
        type: String,
        required: false,
        default: "bioqrafia elave edin"
    },
    admin: {
        type: Boolean,
        default: false,
        required: true
    }
});

//Password Hashing
schema.methods.setPassword = function setPassword(password) {
    this.password = bcrypt.hashSync(password, 10);
}
schema.methods.checkPassword = function checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
}

//jsonwebtoken
schema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            usr: {
                _id: this._id,
                username: this.username,
                email: this.email,
                password: this.password,
                image: this.image,
                bio: this.bio,
                admin: this.admin
            }
        },
        '123456'
    );
};

schema.plugin(uniqueValidator);

const User = mongoose.model('User', schema);
module.exports = User;