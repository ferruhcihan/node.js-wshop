"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model("Product", ProductSchema);
//# sourceMappingURL=Product.js.map