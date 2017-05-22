var express     = require('express');
var app         = express();
var router      = express.Router();
var bodyParser  = require('body-parser'); //to json
var mongoose    = require('mongoose');
var nodemailer  = require('nodemailer');

//Configure app. to use bodyParser() 
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());


router.post('/', handleEmail);

function handleEmail(req, res) {

    var smtpConfig = {
    host: 'official.com.au',
    port: 25,
    secure: false, // use SSL
    ignoreTLS: true
};

    var transporter = nodemailer.createTransport(smtpConfig);

    var name = req.body.contactName;
    var email = req.body.email;
    var phone = req.body.phone;
    var svg = req.body.svg;

    var tableNames = req.body.details.names;
    var year = req.body.details.year;
    var schoolName = req.body.details.school;
    var comments = req.body.details.comments;

    var text = `This is a Design Studio email Acc\n\n
    Customer Name: `+name+`
    Customer Phone: ` +phone+`
    Customer Email: ` + email + `
    School Name: ` + schoolName +`
    Year: `+ year + `
    Design comments:` + comments +`
    Names table` + tableNames;
    

    var mailOptions = {
        from: 'noreply@official.com.au', // sender address
        to: 'it@official.com.au', // list of receivers
        subject: 'Design Studio', // Subject line
        text: text,
        attachments: [
            {
                filename: 'design.svg',
                content: svg,
                contentType: 'image/svg+xml'
            }
        ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({ message: 'error', err: error });
        } else {
            res.json({ message: 'success' });
        };
    });
}

module.exports = router;
