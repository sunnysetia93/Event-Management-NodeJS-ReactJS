const route = require('express').Router();
const User = require('../../db/models').User;

route.get('/',(req,res)=>
{
    User.findAll({
        attributes:['id','email','username']
    }).then((users)=>
    {
        res.status(200).send(users);
    }).catch((err)=>
    {
        res.status(500).send({success : false})
    });
});

route.get('/me',(req,res)=>
{
    User.findOne({
        where:{id:req.user.id}
    }).then((user)=>
    {
        if(!user)
            return res.status(404).send("You are not logged in!");
        res.status(200).send(user);
    }).catch((err)=>
    {
        res.status(500).send({success : false})
    });
})

route.get('/:id',(req,res)=>
{
    User.findByPrimary(req.params.id).then((user)=>
    {
        if(!user)
            return res.status(404).send("User not found!");
        res.status(200).send(user);
    }).catch((err)=>
    {
        res.status(500).send({success : false})
    });
})

module.exports = route;