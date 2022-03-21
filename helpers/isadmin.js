module.exports = {
    isAdm: function(req, res, next) {
        if(req.isAuthenticated() && req.user.isAdm == 1) {
            return next()
        }

        req.flash('error_msg', 'You need be admin')
        res.redirect('/')
    }
}