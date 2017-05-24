var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var Template = require('./product');
var Palette = require('./palette');

var schema = mongoose.Schema;

var UserSchema = new schema(
    {
        name: {type: String, required: false},
        productionId: {type: String, required: false},
        lastname: {type: String, required: false},
        school: {type: String, required: false},
        email: {type: String, required: false, unique: true},
        pass: {type: String, required: false},
        templates: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'ProductTemplateSchema'
            }
        ],
        role: {type: String, required: true}
    });

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('User', UserSchema);
