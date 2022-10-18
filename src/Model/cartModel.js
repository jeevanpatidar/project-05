//=======================================Importing Module and Packages===========================================
const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    userId: { type: objectId, ref: "User", required: true, unique: true },
    items: [{
        _id: false,
        productId: { type: objectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true, default: 1 },
    }],
    totalPrice: { type: Number, required: true, },
    totalItems: { type: Number, required: true, },
}, { timestamps: true })

//====================================Module Export=============================================================
module.exports = mongoose.model('Cart', cartSchema);