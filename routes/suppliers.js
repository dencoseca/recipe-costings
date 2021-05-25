const express = require("express"),
    router = express.Router(),
    Supplier = require("../models/supplier"),
    Product = require("../models/product"),
    middleware = require("../middleware");

// INDEX
router.get("/", (req, res) => {
    Supplier.find({})
        .sort("name")
        .exec((err, suppliers) => {
            if (err) console.log(err);
            res.render("suppliers/index", { suppliers });
        });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("suppliers/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    Supplier.create(req.body.supplier, (err, supplier) => {
        if (err) console.log(err);
        res.redirect("/suppliers");
    });
});

// SHOW
router.get("/:id", (req, res) => {
    Supplier.findById(req.params.id, (err, supplier) => {
        if (err) console.log(err);
        Product.find({ supplier: req.params.id })
            .sort("name")
            .exec((err, products) => {
                if (err) console.log(err);
                res.render("suppliers/show", { supplier, products });
            });
    });
});

// EDIT
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    Supplier.findById(req.params.id, (err, supplier) => {
        if (err) res.redirect("back");
        res.render("suppliers/edit", { supplier });
    });
});

// UPDATE
router.put("/:id", middleware.isLoggedIn, (req, res) => {
    Supplier.findByIdAndUpdate(
        req.params.id,
        req.body.supplier,
        (err, supplier) => {
            if (err) res.redirect("back");
            res.redirect("/suppliers/" + req.params.id);
        }
    );
});

// DESTROY
router.delete("/:id", middleware.isLoggedIn, (req, res) => {
    Supplier.findByIdAndDelete(req.params.id, err => {
        if (err) res.redirect("back");
        req.flash("success", "Supplier deleted");
        res.redirect("/suppliers");
    });
});

module.exports = router;
