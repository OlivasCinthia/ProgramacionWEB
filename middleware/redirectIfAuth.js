/*jshint esversion: 6 */

module.exports = (req, res, next) => {
    if(req.session.userId) {
        return res.redirect('/');
    }
    next();
};