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
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
//CREATE
router.post("/", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = yield newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//UPDATE
router.put("/:id", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//DELETE
router.delete("/:id", verifyTokenAndAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET PRODUCT
router.get("/find/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product.findById(req.params.id);
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
//GET ALL PRODUCTS
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = yield Product.find().sort({ createdAt: -1 }).limit(5);
        }
        else if (qCategory) {
            products = yield Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        }
        else {
            products = yield Product.find();
        }
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
}));
module.exports = router;
//# sourceMappingURL=product.js.map