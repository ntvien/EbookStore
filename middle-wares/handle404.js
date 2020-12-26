module.exports = (req, res, next) => {
    res.statusCode = 404;
    res.render('error/index');
};