"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const router = require("express").Router();
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, } = require("./verifyToken");
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password) {
        // @ts-ignore
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = yield User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//DELETE
router.delete("/:id", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET USER
router.get("/find/:id", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.params.id);
        const _a = user._doc, { password } = _a, others = __rest(_a, ["password"]);
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL USER
router.get("/", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.new;
    try {
        const users = query
            ? yield User.find().sort({ _id: -1 }).limit(5)
            : yield User.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET USERS STATS
router.get("/stats", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = yield User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map