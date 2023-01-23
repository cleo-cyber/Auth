const router=require('express').Router();
const { response } = require('express');
const User=require('../models/User')
const {registerValidation}=require('../validation');
const bcrypt=require('bcryptjs')




router.post('/register',async (req,res)=>{

    // Validate data
    const {error}=registerValidation(req.body); 
   if(error) return res.status(400).send(error.details[0].message)

// Check if user in db
const emailExists=await User.findOne({email:req.body.email});

// Password Hashing

const salt=await bcrypt.genSalt(10);
const hashedPasword=await bcrypt.hash(req.body.password,salt);

if(emailExists) return res.status(400).send("Email Already exists")

//    Create New User
   const user=new User({
    name:req.body.name,
    email:req.body.email, 
    password:hashedPasword,

   });
   try {
    const savedUser= await user.save()
    res.send(savedUser);
   } catch (error) {
    res.status(400).send(error)
   }
})



module.exports=router;