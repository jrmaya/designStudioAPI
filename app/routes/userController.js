var express     = require('express');
var app         = express();
var router      = express.Router();
var bodyParser  = require('body-parser'); //to json
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

var tokenValidator = require('../routes/tokenValidator');


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


// Get single user by ID
router.get('/:user_id', (req, res)=>{
    User.findById(req.params.user_id, (e, user)=>{
        if(e)
            res.send(e);
            res.json(user);
    });
});

// Get user templates
router.get('/userDesigns/:user_id', tokenValidator, (req, res) => {
    User.findById(req.params.user_id, (error, user) => {
        if(error) res.send(error);
        res.json(user.templates);
    });
});


//CREATE NEW USER
router.post('/register-school', function(req, res, next){
        //Get user details
        var name            = req.body.name;
        var lastname        = req.body.lastname;
        var school          = req.body.school; 
        var email           = req.body.email;
        var password        = req.body.password;
        var role            = req.body.role;

        if(role.toLowerCase() !== "school") {
            res.status(400).json({
                message: "Expecting role as school"
            });
        } else {
            //Do validation
            if (!name){
                res.json({message: "Sorry, the post cannot be done with empy values"});
            } else{
                //Create new user and save usr and check for err
                var user            = new User();
                user.name           = name;
                user.lastname       = lastname;
                user.school         = school;
                user.email          = email;
                user.role           = role;
                user.password       = user.generateHash(password);

                user.save(function(err) {
                    if(err === null) {
                        res.json({message: "User was successfully created"});
                    } else {
                        res.status(500).json(err.errors);
                    }
                });
            }
        }

    });

// CREATE ADMIN ACCOUNT !!!!
router.post('/new-admin', function(req, res, next){
        //Get user details
        var name            = req.body.name;
        var lastname        = req.body.lastname;
        var school          = req.body.school; 
        var email           = req.body.email;
        var password        = req.body.password;
        var role            = req.body.role;
            //Do validation
            if (!name){
                res.json({message: "Sorry, the post cannot be done with empy values"});
            } else{
                //Create new user and save usr and check for err
                var user            = new User();
                user.name           = name;
                user.lastname       = lastname;
                user.school         = school;
                user.email          = email;
                user.role           = role;
                user.password       = user.generateHash(password);

                user.save(function(err) {
                    if(err === null) {
                        res.json({message: "User was successfully created"});
                    } else {
                        res.status(500).json(err.errors);
                    }
                });
            }

    });

router.post('/check-email', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user){
        if (err) {return err}
        else{
            if(user.email == null){
                res.send({message: "available"});
            }else{
                res.send({'message': "taken"});
            }
        }
    });
});

// Update user
router.put('/:user_id', (req, res) => {
        User.findById(req.params.user_id, (error, user) => {
        if(error) res.send(error);

            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.school = req.body.school;
            user.email = req.body.email;
            user.password = req.body.pass;
            user.templates = req.body.svg;

            user.save().then(res.json({message: 'User updated successfully! '+ user}));
    });
});

// Change user password /users/id
// TODO: set temp token with the url
router.put('/reset/:user_id', (req, res) => {
    User.find({_id: req.params.user_id}, (err, usuario) => {
        try{
            var usuario = new User(usuario);
            usuario.password = req.body.password;
            usuario.save().then(res.json({message: 'password changed'})).catch(err);
        } catch(e) {
            console.log(e);
        }
    });
});


// Add templates
router.put('/templates/:user_id', tokenValidator, (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {$push: {"templates": req.body.svg}}, {}, function(error, template){
        if(error) res.send(error);
        res.send({'message': 'Template added successfully'})
    })
});

// Delete template
router.put('/deleteTemplate/:user_id',tokenValidator, (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {$pull: {"templates": req.body.svg}}, {}, function(error, template){
        if(error) res.send(error);
        res.send({'message': 'Design removed successfully'})
    })
});

// Delete user
router.delete('/users/:user_id', function (req, res) {

    User.remove({
            "_id": req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User successfully deleted' });
        });
});


module.exports = router;
