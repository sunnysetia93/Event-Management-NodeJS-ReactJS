const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../db/models').User;
const AuthToken = require('../db/models').AuthToken;

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(userKey,done){
    User.findByPrimary(userKey).then((user)=>
    {
        done(null,user);
    }).catch((err)=>
    {
        done(err);
    });
});

passport.use(new LocalStrategy(function(username,password,done){
    User.findOne(
        {
            where:{
                username:username,
                password:password
            }
        }).then((user)=>
        {
            if(!user)
            {
                return done(null,false,{message:'Username or Password didn\'t match'});
            }

            return done(null,user);
        }).catch((err)=>{
            return done(err);
        })
}));

passport.use(new BearerStrategy(function(token,done)
{
    AuthToken.findOne({
        where:{
            token:token
        },
        include:[User]
    }).then((token)=>
    {
        if(!token)
        return done(null,false,{message:'No such Token found'});

        done(null,token.user);
    }).catch((err)=>{
        return done(err);
    })
}))

module.exports = passport;