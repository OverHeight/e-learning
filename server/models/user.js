const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true},
    password: { type: String, required: true },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "1d"});
    return token
};

const User = mongoose.model("user", userSchema)

const validateRegister = (data) => {
    const schema = Joi.object({
       firstName: Joi.string().required().label("First Name"),
       lastName: Joi.string().required().label("Last Name"),
       username: Joi.string().required().label("Username"),
       email: Joi.string().email().required().label("Email"),
       password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data)
}

const validateLogin = (data) => {
    const schema = Joi.object({
      username: Joi.string().required().label("Username"),
      password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
  };

module.exports = { User, validateRegister, validateLogin }