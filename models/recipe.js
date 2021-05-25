const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    totalPortions: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ingredient"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
