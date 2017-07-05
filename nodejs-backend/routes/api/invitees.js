const route = require('express').Router();
const EventInvitee = require('../../db/models').EventInvitee;
const Event = require('../../db/models').Event;
const Invitee = require('../../db/models').Invitee;
const mailer = require('../../utils/inviteeMailer');
const uid2 = require('uid2');



route.get('/:id/invitees',(req,res)=>
{
    console.log("event id: " + req.params.id)

    EventInvitee.findAll({
        attributes:['id'],
        where:{
            eventId:req.params.id,
            '$event.hostId$':req.user.id,   //refer to a column -> '$columnName$'
        },
        include:[{
            model:Invitee,
            as:'invitee',
            attributes:['id','email'],
        },
        {
        model:Event,
        as:'event',
        attributes:['id','title','venue','hostId']
        }]
    }).then((invitees)=>
    {
        if(invitees)
        {
            console.log("invitees found")
            res.status(200).send(invitees);
        }
        else
            res.status(500).send('No invitees were found this evnet');    
    });

});

route.delete('/:id/invitees/:invId',(req,res)=>
{   
    EventInvitee.destroy({
        where:{
            eventId:req.params.id,
            inviteeId:req.params.invId,
        }
    }).then((destroyedInvitee)=>
    {
        if(destroyedInvitee==0)
            res.status(403).send('Invitee Could not be deleted');
        else
            res.status(200).send({success:true});
    })
});

route.post('/:id/invitees/sendmail',(req,res)=>
{
    console.log("inside sendmail");
    EventInvitee.findAll({
        where : {
            eventId : req.params.id
        },
        include:[{
            model:Invitee,
            as:'invitee',
            attributes:['id','email']
        }]
    }).then((inviteesList)=>
    {

        for(var inv of inviteesList)
        {
            mailer.sendInviteWithToken(inv.invitee.email,inv.token,inv.eventId,function()
            {
                console.log("Invite send to : " + inv.invitee.email);
            })
            
        }
        res.send(inviteesList)
    })
})

route.put('/:id/invitees', (req, res) => {
    console.log(req.body.invitees);
    let invitees = req.body.invitees.split(';');
    invitees = invitees.map((i) => {
        return {email: i.trim()}
    });
    Invitee.bulkCreate(invitees, {
        ignoreDuplicates: true
    }).then((invitee) => {
            let eventInvitee = invitee.map((i) => 
            {
                    return {
                            eventId: req.params.id,
                            inviteeId: i.id,
                            email:i.email
                        }
            });

            for(var ev of eventInvitee)
            {
                if(!ev.inviteeId)   //invitees that already exists in Invitee table
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
                            eventId:ev.eventId,
                            inviteeId:inv.id,
                            token:uid2(25)

                        })
                    })
                }
                else{   // new Invitee

                    EventInvitee.create(
                        {
                            eventId:ev.eventId,
                            inviteeId:ev.inviteeId,
                            token:uid2(25)

                        }
                    )
                }
            }

        res.status(200).send("Records Updated!");
    }).catch((err)=>
    {
            res.status(500).send("Updated!");
        
    })
});


module.exports = route;