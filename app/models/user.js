var mongoose    = require('mongoose');
var schema      = mongoose.Schema;

var bcrypt      = require('bcrypt');

//get garmentSchema & paletteSchema for the user
var Template    = require('./product');
var Palette     = require('./palette');


var UserSchema = new schema(
    {
    name: { type: String, required: false },
    productionId: { type: String, required: false }, 
    lastname: { type: String, required: false },    
    school: { type: String, required: false },
    email: { type: String, required: false },
    pass: { type: String, required: false },
    palette: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'PalettetSchema'
            }
        ],
    templates: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'ProductTemplateSchema'
        }
    ]    
});

UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

module.exports = mongoose.model('User', UserSchema);