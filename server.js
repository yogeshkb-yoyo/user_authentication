const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Server Listening on port: " + port));



app.use(express.json());
app.use(cors());
// MongoDB connection setup
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://127.0.0.1:27017/otp-manager';
const dbName = 'otp-manager';


// Generate random OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}




var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3969a97e4663dd",
    pass: "7b778161e65746"
  }
});

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });



const otpSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    default: '0'
  }
});



const OTP = mongoose.model('userdetails', otpSchema);

// Save email and OTP in the database and send OTP email
app.post('/api/saveEmail', (req, res) => {
  const email = req.body.email;
  const otp = generateOTP();

  OTP.insertMany({
    email : email,
    otp : otp
  }).then((ans) => {
    const OTPverification = {
      from: "yoyokb404@gmail.com", 
      to: `${email}`,//verificationMailIdValue for realtime purpose
      subject: "OTP Verification Mail",
      text: `OTP verification Code is ${otp}.If Not Please Ignore.`
    }

    transporter.sendMail(OTPverification, (err, result) => { 
      if (err) {
        console.log(err);
        return;
      }
      res.send({});
    })
  }).catch((err) => {
    console.log(err.Message);
  })
});


// Verify OTP
app.post('/api/verifyOTP', async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  try {
    const user = await OTP.findOne({ email }).sort({ _id: -1 }).limit(1);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp.toString() === otp) {
      // Correct OTP
      res.status(200).json({ message: 'OTP verification successful' });
    } else {
      // Incorrect OTP
      res.status(400).json({ message: 'Incorrect OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user from the database' });
  }
});






