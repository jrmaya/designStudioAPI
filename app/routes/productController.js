var express = require('express');
var app = express();
var router = express.Router();
var bodyParser  = require('body-parser'); //to json
var fs = require('file-system');

//use multer to upload files to server and save with the proper extention
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/')
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '.jpeg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });
 
//import user model
var Product        = require('../models/product');

//Use model if new cat. is created from here. Needs category model update
//var Category       = require('../models/category'); 

//Get DB connection
var db          = require('../../server');

// Require validator for the routes 
var tokenValidator = require('../routes/tokenValidator');

//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());




// ==============================================================================================================
//API ROUTES

//GET ALL PRODUCTS
router.get('/', function(req, res, next) {
    Product.find(function(err, doc) {
            if (err)
                res.send(err);
            res.json(doc);
        });

});


//GET PRODUCT BY SPECIFIED CATEGORY 
router.get('/:category', function(req, res, next){
    Product.find({category_id: req.params.category}, function(err, doc){
        if(err)
        res.send(err);
        res.json(doc);
    })
});


// CREATE A NEW PRODUCT
// Check if token is valid for the next routes

router.post('/newProduct', tokenValidator, function(req, res){
    //GET REQ DETAILS
    var category_id = req.body.category_id;
    var name = req.body.name;
    var description = req.body.description;
    var svg = req.body.svg;
    var svgUrl = req.body.svgUrl; //missing


    //CREATE A NEW PRODUCT AND SET PARAMS
    var product = new Product();
    product.category_id = category_id;
    product.name = name;
    product.description = description;
    product.svg = svg;
    product.svgUrl = svgUrl;
    product.active = true;

    for (var tag in req.body.tags) {
        var t = req.body.tags[tag];
        product.tags.push(t);
    }
    
    product.save().then(res.json({message: 'Item created successfully! '}));
    

})

//UPLOAD LOGO TO SERVER
    .post('/uploadImages', upload.single('image'), function (req, res, next) {
        let path = req.file.path;
        res.json({message:'Image created succesfully', path: path})
})


//UPDATE A PRODUCT 
.put('/:id', tokenValidator, function(req, res){
    Product.findById(req.params.id, function(e, product){
        try{
        product.name = req.body.name;
        product.description = req.body.description;
        product.svg = req.body.svg;
        product.category_id = req.body.category_id;    
        product.active = req.body.active;

        product.tags = [];
        for (var tag in req.body.tags) {
            var t = req.body.tags[tag];
            product.tags.push(t);
        }
        product.save().then(res.json({message: 'Product updated successfully! '+ product}));
        }
        catch(e){
            res.json({ message: 'There has been an error' } + e);
        }
    })
})

//Remove by id
.delete('/:id', tokenValidator, function(req, res){
    Product.remove({_id: req.params.id }, function(err, product){
        try{
            res.json({ message: 'The product has been removed succesfully' });
        }
        catch(err){ 
            res.json({ message: 'There has been an error' } + err);
        }
    })
})

//Remove all innactive products
.post('/removeAllInactive', tokenValidator, function(req,res){

    //Remove all unactive
    var query = Product.find({ active: false }).select('_id').remove();

    query.exec(function(e, id){
        if(e)
        send(e);
        res.json({ message: 'Items deleted succesfully' });
    });
});

//Remove multiple from a list ?

module.exports = router;
