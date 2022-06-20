var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//! REGISTER
router.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const newUser = new User({
        username,
        email,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC_KEY).toString(),
    });
    try {
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//! LOGIN
router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const user = yield User.findOne({ username });
        !user && res.status(401).json("Wrong credentials!");
        const dbPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC_KEY).toString(CryptoJS.enc.Utf8);
        if (dbPassword !== password) {
            res.status(401).json("Wrong credentials!");
        }
        else {
            const _a = user._doc, { password } = _a, rest = __rest(_a, ["password"]);
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC_KEY, { expiresIn: "3d" });
            res.status(200).json(Object.assign(Object.assign({}, rest), { accessToken }));
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map