const route = require('express').Router();
const Event = require('../../db/models').Event;
const User = require('../../db/models').User;
const Invitee = require('../../db/models').Invitee;
const EventInvitee = require('../../db/models').EventInvitee;
const uid2 = require('uid2');

route.use('/',require('./invitees'));

route.get('/',(req,res)=>
{
    Event.findAll({
        attributes:['id','title','venue','startTime','endTime','hostId']
    }).then((events)=>{

        res.status(200).send(events);

    }).catch(function(err){

        console.log(err);
        res.status(500).send("Error Retrieveing Events");
    });
});

route.get('/:id',(req,res)=>
{
    Event.findOne({
        where : {
            id:req.params.id,
            hostId:req.user.id 
        },
        include:[{
            model:User,
            as:'host',
            attributes:['username','email']
        }]
    }).then((event)=>
    {
        if(!event)
            return res.status(500).send("No such event found!");
        res.status(200).send(event);
    }).catch((err)=>
    {
        console.log(err);
        res.status(500).send("Error Retrieveing Events");
    })
})

route.post('/add',(req,res)=>
{
    if(!req.body.title)
        return res.status(403).send("Event cannot be created with empty title!");

    Event.create({
    title:req.body.title,
    venue: req.body.venue,
    imgUrl: req.body.imgUrl,
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    message: req.body.message,
    hostId:req.user.id
    }).then((event)=>
    {
        // res.status(200).send(event);

        if(req.body.invitees)
        {
            let invitees = req.body.invitees.split(';');
            invitees = invitees.map((i)=>
            {
                // console.log(i.id);
                return { email : i.trim() }
            });
            
            Invitee.bulkCreate(invitees,{ 
                ignoreDuplicates:true
               
            }).then((invitee) => {
                let eventInvitee = invitee.map((i) => 
                {
                        return {
                                eventId: event.id,
                                inviteeId: i.id,
                                email:i.email
                            }
                });

                for(var ev of eventInvitee)
                {
                    if(!ev.inviteeId)
                    {
                        Invitee.find({
                            where:
                            {
                                email:ev.email
                            }
                        }).then((inv)=>
                        {
                            // console.log(inv);
                            EventInvitee.create({
                                eventId:event.id,
                                inviteeId:inv.id,
                                token:uid2(25)
                            })
                        })
                    }
                    else
                    {

                        EventInvitee.create(
                            {
                                eventId:ev.eventId,
                                inviteeId:ev.inviteeId,
                                token:uid2(25)
                            }
                        )
                    }
                }

                res.status(200).send(event);

            })
        }
        else
        {
            return res.status(200).send(event);
        }

    }).catch((err)=>
    {
        res.status(500).send("There is an error creating this event.");
    });
});

   
// yet to add clause for existing invitees in invitee table, 
//for just adding invitees to an existing event, that API is present in invitee.js
route.put('/:id',(req,res)=> 
{
    Event.update({
        title:req.body.title,
        venue: req.body.venue,
        imgUrl: req.body.imgUrl,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
        endTime: req.body.startTime ? new Date(req.body.endTime) : undefined,
        message: req.body.message,

    },
    {
    where : {
        id:req.params.id,
        hostId:req.user.id
    }
    }).then((updatedRows)=>
    {
        if(updatedRows[0]==0)
            return res.status(403).send("Event does not exist, or cannot be edited.");
        res.status(200).send('Updated Successfully!');
    }).catch((err)=>
    {
        res.status(500).send(err);
    });
});



route.delete('/:id',(req,res)=>{

    Event.destroy({
        where:{
            id:req.params.id,
            hostId:req.user.id
        }
    }).then((deletedRows)=>
    {
        if(deletedRows==0)
            return res.status(403).send("Event does not exist, or you cannot delete it");
        res.status(200).send('Deleted Successfully!');
    }).catch((err)=>
    {
        res.status(500).send(err);
    }
)});



module.exports = route;

