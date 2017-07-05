const route = require('express').Router();
const User = require('../db/models').User;
const passport = require('../auth/passport');
const eli = require('../auth/utils').eli;
const AuthToken = require('../db/models').AuthToken;
const EventInvitee = require('../db/models').EventInvitee
const uid2 = require('uid2');

route.get('/events/:evId/:token/:rsvp',(req,res)=>
{
    console.log("event id : "+req.params.evId);
    console.log("token is : "+ req.params.token);
    console.log("Response : "+req.params.rsvp);

    var response = req.params.rsvp==='yes'?true:false;

    EventInvitee.update(
        {
            rsvp:response
        },
        {
        where : 
        { 
            token : req.params.token,
            eventId : req.params.evId
        }
    }).then((done)=>
    {
        res.send("You response has been acknowledged. Thank you!");
    })

})

route.post('/signup',(req,res)=>
{
    User.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password  //not recommended. Use Hashed Passwords
    }).then((user)=>
    {
        res.redirect('/login.html');
    }).catch((err)=>
    {
        res.status(500).send(err);
    });
});

route.post('/login',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'login.html'
}));

route.get('/logout',(req,res)=>
{
    console.log("User Id - "+ req.user.id + ' Logged Out')
    req.user=null;
    req.logout();
    req.session.destroy(function()
    {
        res.redirect('/login.html');
    })
})

route.get('/profile',eli('/login.html'),(req,res)=>
{
    res.send(req.user);
});

route.get('/token',eli('/login.html'),(req,res)=>
{
    AuthToken.findByPrimary(req.user.id).then((authToken)=>
    {
        if(!authToken)
            return res.status(404).send("Not Found");
        res.send(authToken.token);
    }).catch((err)=>
    {
       return res.status(500).send(err);
    })
})

route.post('/token',passport.authenticate('local'),(req,res)=>
{
    console.log("Inside Post Token");
    AuthToken.create({
        token:uid2(20),
        userId:req.user.id
    }).then((authToken)=>
    {
        console.log(authToken.token);
        return res.send(authToken.token)
    });
});

module.exports = route;