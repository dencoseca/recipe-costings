const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

// =====================
// LANDING ROUTE
// =====================

router.get("/", (req, res) => {
    res.render("landing");
});

// =====================
// AUTH ROUTES
// =====================

// REGISTER FORM
router.get("/register", (req, res) => {
    res.render("register");
});

// REGISTER LOGIC
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username });
    if (req.body.adminCode === "secretcode123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash(
                    "success",
                    `Hi ${user.username}! Let's start creating recipes!`
                );
                res.redirect("/recipes");
            });
        }
    });
});

// LOG IN FORM
router.get("/login", (req, res) => {
    res.render("login");
});

// LOG IN LOGIC
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/recipes",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);

// LOG OUT LOGIC
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("back");
});

module.exports = router;
