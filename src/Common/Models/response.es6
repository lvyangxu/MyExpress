module.exports = {
    success: (res, message)=> {
        message = (message == undefined) ? "" : message;
        res.send({success: "true", message: message});
    },
    fail: (res, message)=> {
        message = (message == undefined) ? "" : message;
        res.send({success: "false", message: message});
    }
};