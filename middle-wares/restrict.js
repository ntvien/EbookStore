module.exports = (req, res, next) => {
    if (req.session.isLogged === true) {
        next();
    } else {
        res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    }
}