const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
    quantity: Number,
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

ingredientSchema.methods.costForRecipe = function() {
    return (this.product[0].pricePerKilo() / 1000) * this.quantity;
};

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
