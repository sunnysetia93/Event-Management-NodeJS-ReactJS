const express = require('express');
const bp = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const passport = require('./auth/passport');

const app = express();

app.use(cors());

app.use(bp.json());
app.use(bp.urlencoded({extended:true}));

app.use(cookieParser('my super secret'));
app.use(expressSession({
    secret:'my super secret',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());  
app.use(passport.session());    //give this line whereever you wish to maintain sessions for. Right now it is global.

app.use('/api',require('./routes/api'));    //api routes
app.use('/',require('./routes/index'));     //login,logout,signup,token
app.use('/',express.static(__dirname+'/public_static'));

app.listen('8888',()=>{
    console.log("Server live on localhost:8888");
})