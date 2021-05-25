const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Recipe = require("../models/recipe"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) console.log(err);
        res.render("comments/new", { recipe });
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/recipes");
        }
        Comment.create(req.body.comment, (err, comment) => {
            if (err) console.log(err);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            recipe.comments.push(comment);
            recipe.save();
            res.redirect("/recipes/" + recipe._id);
        });
    });
});

// EDIT
router.get(
    "/:comment_id/edit",
    middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) res.redirect("back");
            res.render("comments/edit", { comment, recipe_id: req.params.id });
        });
    }
);

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, comment) => {
            if (err) res.redirect("back");
            req.flash("success", "Comment successfully updated");
            res.redirect("/recipes/" + req.params.id);
        }
    );
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, err => {
        if (err) res.redirect("back");
        req.flash("success", "Comment deleted");
        res.redirect("/recipes/" + req.params.id);
    });
});

module.exports = router;
