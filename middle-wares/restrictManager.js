module.exports = (req, res, next) => {
    if (req.session.Authorized === 1) {
        next();
    } else {
        res.redirect(`/`);
    }
}