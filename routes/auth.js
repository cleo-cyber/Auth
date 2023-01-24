const router = require('express').Router();
const { response } = require('express');
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



router.post('/register', async (req, res) => {

   // Validate data
   const { error } = registerValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message)

   // Check if user in db
   const emailExists = await User.findOne({ email: req.body.email });
   if (emailExists) return res.status(400).send("Email Already exists")
   // Password Hashing

   const salt = await bcrypt.genSalt(10);
   const hashedPasword = await bcrypt.hash(req.body.password, salt);



   //    Create New User
   const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPasword,

   });
   try {
      const savedUser = await user.save()
      res.send({ user: user.id });
   } catch (error) {
      res.status(400).send(error)
   }
})


router.post('/login', async (req, res) => {
   // Login Validation and Checking
   const { error } = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message)

   const user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send("Email not correct")

   const validPass = await bcrypt.compare(req.body.password, user.password)
   if (!validPass) return res.status(400).send("Invalid password")


   const token = jwt.sign({
      _id: user._id
   },
      process.env.TOKEN_SECRET
   )
   res.header('auth-token',token).send(token)

})


module.exports = router;