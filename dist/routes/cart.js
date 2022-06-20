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
Object.defineProperty(exports, "__esModule", { value: true });
const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, } = require("./verifyToken");
const router = require("express").Router();
//CREATE
router.post("/", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCart = new Cart(req.body);
    try {
        const savedCart = yield newCart.save();
        res.status(200).json(savedCart);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCart = yield Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedCart);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//DELETE
router.delete("/:id", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL
router.get("/", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield Cart.find();
        res.status(200).json(carts);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=cart.js.map