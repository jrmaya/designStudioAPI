var express     = require('express');
var app         = express();
var router      = express.Router();
var bodyParser  = require('body-Parser'); //to json
var mongoose    = require('mongoose');

var bcrypt      = require('bcrypt');

//auth router
var auth        = express.Router();

//Get JsonWebToken
var jwt         = require('jsonwebtoken');

//import user model
var User        = require('../models/user');

//Get DB connection
var db          = require('../../server');



//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());



// ==============================================================================================================
//API ROUTES

//GET ALL USERS
router.get('/users', function(req, res, next) {
    User.find(function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });

});


//Routes for /api/v1/users/:user_id
//Get single user by ID
router.get('/users/:user_id', (req, res)=>{
    User.findById(req.params.user_id, (e, user)=>{
        if(e)
            res.send(e);
            res.json(user);
    });
});


//CREATE NEW USER
router.post('/newUser', function(req, res, next){
        //Get user details
        var name            = req.body.name;
        var lastname        = req.body.lastname;
        var school          = req.body.school; 
        var email           = req.body.email;
        var pass            = req.body.pass;


        //Do validation
        if (!name){
            res.json({message: "Sorry, the post cannot be done with empy values"});
        }else{
            //Create new user and save usr and check for err 
            var user            = new User();
            user.name           = name;
            user.lastname       = lastname;
            user.school         = school;
            user.email          = email;
            user.pass           = user.generateHash(pass);
     
            user.save().then(res.json({message: 'User created successfully! '}));
        }
    })

//Update user
.put('/users/:user_id', (req, res)=>{
        User.findById(req.params.user_id, (e, user)=>{
        if(e)
            res.send(e);
            
            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.school = req.body.school;
            user.email = req.body.email;
            user.pass = req.body.pass;
            user.save().then(res.json({message: 'User updated successfully! '+ user}));
    }); 
})

// Delete user
.delete('/users/:user_id', function (req, res) {

    User.remove({
            "_id": req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User successfully deleted' });
        });
});


module.exports = router;