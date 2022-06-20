"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (authHeader.split(" ")[0] !== "Bearer")
            return res.status(403).json("Token is not valid!");
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
            if (err)
                res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json("You are not authenticated!");
    }
};
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};
//# sourceMappingURL=verifyToken.js.map