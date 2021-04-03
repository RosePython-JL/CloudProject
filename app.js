/*
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


/*
 * Import required packages.
 * Packages should be installed with "npm install".
 */
const express = require('express');
const aws = require('aws-sdk');

/*
 * Set-up and run the Express app.
 */
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);
const bodyParser = require('body-parser');
/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'us-east-1';

/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;

/*
 * Respond to GET requests to /account.
 * Upon request, render the 'account.html' web page in views/ directory.
 */
app.get('/', (req,res) => res.render('index.html'))
app.get('/index', (req,res) => res.render('index.html'))

app.get('/account', (req, res) => res.render('account.html'));
app.get('/experiment', (req, res) => res.render('experiment.html'));
app.get('/history', (req, res) => res.render('history.html'));
app.get('/theorem1', (req, res) => res.render('theorem1.html'));
app.get('/quiz', (req, res) => res.render('quiz.html'));
/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify("File Uploaded Successfuly! My website"));
});

app.use(bodyParser.urlencoded({ extended: true })); 

//Try to use nodemailer to send email, but something wrong, cannot get value from quiz page.
app.post('/sendEmail', (req, res) => {
  var userEmail = req.body.userEmail;
  var score = req.body.score;
  var nodemailer = require('nodemailer');
  var text = "You score is " + score;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lausing1997@gmail.com',
    pass: '' // password 
  }
});

//Information about the mail
var mailOptions = {
  from: 'lausing1997@gmail.com',
  to: userEmail,
  subject: 'Result of Quiz',
  text: text
};

//send email and check error 
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

});
