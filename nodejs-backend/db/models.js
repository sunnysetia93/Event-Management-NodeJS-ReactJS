const Sequelize = require('sequelize');
const info = require('../utils/config');

const db = new Sequelize({
    username:info.db.username,
    password:info.db.password,
    database:'eventmgmt',
    host:'localhost',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:10000
    }
});

const Event = db.define('event',{
    id :{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:Sequelize.STRING,
    venue: Sequelize.STRING,
    imgUrl: Sequelize.STRING,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    message: Sequelize.STRING
});

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

const Invitee = db.define('invitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        index: true
    }
});

const EventInvitee = db.define('eventinvitee', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rsvp:Sequelize.BOOLEAN,
    token:Sequelize.STRING
});

const AuthToken = db.define('authtoken', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: Sequelize.STRING,
        unique: true,
        index: true
    }
});

Event.belongsTo(User,{
    foreignKey:'hostId',
    as:'host'
});
User.hasMany(Event,{
    foreignKey:'hostId'
});

EventInvitee.belongsTo(Event);
Event.hasMany(EventInvitee);
EventInvitee.belongsTo(Invitee);
Invitee.hasMany(EventInvitee);

AuthToken.belongsTo(User);
User.hasMany(AuthToken);

db.sync({force:false}).then(()=>
{
    console.log("DB Synced!");
})

module.exports = {
    Event,User,Invitee,EventInvitee,AuthToken
}