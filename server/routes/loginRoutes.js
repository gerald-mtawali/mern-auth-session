const UserSchema = require("../models/UserSchema");
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router(); 

// router.get('/login', async (req, res) => {
//     res.send('login page');
// }); 

// Register Post request, where a newUser is added to the db with certain parameters
router.post('/register', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password )
        return res.status(400).json({ msg: 'Password and email are required'});

    if (password.length < 8){
        return res.status(400).json({ msg: 'Password should be at least 8 characters long'});
    }

    const user = await UserSchema.findOne({ email }); // locate a potential user in the db 
    if ( user ) return res.status(400).json({ msg: 'User already exists'});

    const newUser = new UserSchema({ email, password });

    //hash the password 
    bcrypt.hash(password, 7, async (err, hash) => {
        if (err) 
            return res.status(400).json({ msg: 'error while saving the password'})
        newUser.password = hash; 
        const savedUserRes = await newUser.save(); 

        if (savedUserRes)
            return res.status(200).json({ msg: 'user has been successfully saved'})
    });
}); 


router.post('/login', async (req, res) => {
    const { email, password } = req.body; 

    if (!email || !password ) {
        res.status(400).json({ msg: 'Something Missing '});
    }
    const user = await UserSchema.findOne({ email: email}); // search for the email in db 

    if (!user) {
        return res.status(400).json({ msg: 'User not found'}); 
    }

    // compare the entered password with the hashed version in the db 
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
        // create user session to keep the user logged in even when a refresh is performed
        const userSession = { email: user.email }; 
        req.session.user = userSession; // attach user session to a user object 
        // attach userSession id to response, which will transfer in cookies
        return res.status(200).json({msg: 'You have logged in successfully', userSession});
    } else {
        return res.status(400).json({ msg: 'Invalid Credentials'}); 
    }
}); 

router.get('/isAuth', async (req, res) => {
    if (req.session.user) {
      return res.json(req.session.user)
    } else {
      return res.status(401).json('unauthorize')
    }
});

router.delete(`/logout`, async (req, res) => {
    req.session.destroy((error) => {
      if (error) throw error
  
      res.clearCookie('session-id') // cleaning the cookies from the user session
      res.status(200).send('Logout Success')
    })
  })

module.exports = router; 