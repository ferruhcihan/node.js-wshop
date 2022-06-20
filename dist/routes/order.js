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
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, } = require("./verifyToken");
const router = require("express").Router();
//CREATE
router.post("/", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = yield newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//UPDATE
router.put("/:id", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedOrder);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//DELETE
router.delete("/:id", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order.find();
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = yield Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=order.js.map