const route = require('express').Router();
const passport = require('../../auth/passport');

route.use(passport.authenticate('bearer'));    // ['bearer','session']

route.use('/events',require('./events'));
route.use('/users',require('./users'));

module.exports = route;