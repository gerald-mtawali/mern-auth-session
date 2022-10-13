require('dotenv').config();
const session = require('express-session');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// add  the following package to store the user session id automatically in mongodb
const MongoDBStore = require('connect-mongodb-session')(session); 

const loginRouter = require('./routes/loginRoutes');
const app = express(); 
const MAX_AGE = 1000 * 60 * 60 * 3; 
const port = process.env.PORT || 5001;

const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200, 
}

// connect to the MongoDB db
mongoose.Promise = global.Promise; 
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, 
    {
        useNewUrlParser: true,
}); 

const mongoDBstore = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION_STRING, 
    collection: 'mernAuthSessions',
});

// find a way to generate a secret token randomly for each session 
app.use(
    session({
        secret: 'a1s2d3f4g5h6', 
        name: 'session-id', // cookies name to be put in "key" field in postman
        store: mongoDBstore, 
        cookie: {
            maxAge: MAX_AGE, // expiration date of the cookie 
            samesite: false, // specify the SamesSite Set-Cookie attribute to false, the cookie does not need to be restricted to sames-site context 
            secure: false, // this ensures that cookies are sent over HTTPS protocol, this will be set to true when in production
        }, 
        resave: true, // forces session to be saved back to session store
        saveUninitialized: false,  // forces session that is "unitialized" to be saved to the store, set to false due to login purposes

    }));
//make the CORS and json middleware functions available for all requests in the application
app.use(cors(corsOptions)); 
app.use(express.json());

// use the loginRoutes for any call made under the /api
app.use('/api', loginRouter); 

//Start Server 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`); 
}); 

module.exports = app;