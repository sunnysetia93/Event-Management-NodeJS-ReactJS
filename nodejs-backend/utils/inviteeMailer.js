const nodemailer = require('nodemailer');
const info = require('./config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth:
    {
        user:info.mail.email_id,
        pass: info.mail.password
    }

})

function createInvite(inviteeEmail) {
    return {
        from: 'sunnysetia93@gmail.com',
        to: (typeof inviteeEmail == 'string') ? inviteeEmail : inviteeEmail.join(','),
        subject: 'You are invited to an event at Nagarro',
        html: "<h3> Please come there's free lunch </h3>"
    }
}

function sendInvite(inviteeEmail, done) {
    transporter.sendMail(createInvite(inviteeEmail), (err, info) => {
        if (err) {
            throw err
        }
        if (done) {
            done(info);
        }
    })
}
function createInviteWithToken(inviteeEmail,inviteeToken,inviteeEventId)
{
    var link  = 'http://localhost:8888/events/'+inviteeEventId+'/'+inviteeToken;
        return {
        from: 'sunnysetia93@gmail.com',
        to: inviteeEmail,
        subject: 'You are invited to an event at Nagarro',
        html: '<h3> Please visit the link below for RSVP : </h3> <br> If you are coming, Click Here : <a href="'+ link + '/yes">http://localhost:8888/events/'+inviteeEventId+'/'+inviteeToken+'/yes</a><br> If you are not coming, Click Here : <a href="'+ link + '/no">http://localhost:8888/events/'+inviteeEventId+'/'+inviteeToken+'/no</a>' +
                '<br> Thank You.'
    }
}
//<a href="+link+">Click Here</a>

function sendInviteWithToken(inviteeEmail,inviteeToken,inviteeEventId,done)
{
    transporter.sendMail(createInviteWithToken(inviteeEmail,inviteeToken,inviteeEventId,(err,info)=>
    {
        if(err)
            throw err;
        if(done)
            done(info);
    }))
}

module.exports = {
    sendInvite,sendInviteWithToken
};