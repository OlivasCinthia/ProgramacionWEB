/*jshint esversion: 6 */

module.exports =(req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};