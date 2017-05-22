var express     = require('express');
var app         = express();
var router      = express.Router();
var bodyParser  = require('body-parser'); //to json

// Bcrypt to decode and compare password
var bcrypt      = require('bcrypt');


// Get JsonWebToken
var jwt         = require('jsonwebtoken');

// Import user model
var User        = require('../models/user');

// Get DB connection
var db          = require('../../server');



//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());


// ==============================================================================================================
//API ROUTES

router.post('/', function(req, res){
    User.findOne({ "name" : req.body.username }, function(err, user){
        if (err) throw err;
        if (!user){
            res.json({ message: "The user couldnt be found" });
        } else {
            //if pass wrong reject, else assign token
            bcrypt.compare(req.body.password, user.pass, function(err, doesMatch){
                if(doesMatch){
                    var token = jwt.sign(user, process.env.SECRET_KEY, {
                    });
                    res.json({
                        success: true,
                        token: token
                    });    

                } else {
                    res.json({ message: "You have entered the wrong password"});   
                }
            });
        }
    });
});

module.exports = router;
