function ensureLoggedIn(redirPath) {

    return function (req, res, next) {

        if (!req.user) {
            res.redirect(redirPath)
        } else {
            console.log("Ensure Logged In - Success.");
            next();
        }

    }

}

module.exports = {
    eli: ensureLoggedIn
};