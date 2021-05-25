const Recipe = require("../models/recipe"),
    Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Recipe.findById(req.params.id, (err, recipe) => {
            if (err) {
                req.flash("error", "Recipe not found");
                res.redirect("back");
            } else {
                if (recipe.author.id.equals(req.user._id) || req.user.isAdmin) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (
                    comment.author.id.equals(req.user._id) ||
                    req.user.isAdmin
                ) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;
