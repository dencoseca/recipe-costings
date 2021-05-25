const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    packWeight: Number,
    price: Number,
    supplier: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier"
        }
    ]
});

productSchema.methods.pricePerKilo = function() {
    return (this.price / this.packWeight) * 1000;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
