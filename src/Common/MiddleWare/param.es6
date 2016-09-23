module.exports = (req, res, next)=> {
    for (let k in req.query) {
        req.query[k] = req.query[k].urlBase64Decode();
    }
    for (let k in req.body) {
        req.body[k] = req.body[k].urlBase64Decode();
    }
    next();
};