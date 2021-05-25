const express = require("express"),
    router = express.Router(),
    Product = require("../models/product"),
    Supplier = require("../models/supplier"),
    middleware = require("../middleware"),
    Recipe = require("../models/recipe");

// INDEX
router.get("/", (req, res) => {
    Product.find({})
        .sort("name")
        .exec((err, products) => {
            if (err) console.log(err);
            res.render("products/index", { products });
        });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Supplier.find({})
        .sort("name")
        .exec((err, suppliers) => {
            if (err) console.log(err);
            res.render("products/new", { suppliers });
        });
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    const newProduct = req.body.product;
    if (newProduct.image === "")
        newProduct.image =
            "https://images.unsplash.com/photo-1562051725-9f20596fc3e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";
    Product.create(newProduct, (err, product) => {
        if (err) console.log(err);
        res.redirect("/products");
    });
});

// SHOW
router.get("/:id", (req, res) => {
    Product.findById(req.params.id)
        .populate("supplier")
        .exec((err, product) => {
            if (err) console.log(err);
            res.render("products/show", { product });
        });
});

// EDIT
router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    Product.findById(req.params.id)
        .populate("supplier")
        .exec((err, product) => {
            if (err) res.redirect("back");
            Supplier.find({})
                .sort("name")
                .exec((err, suppliers) => {
                    if (err) console.log(err);
                    res.render("products/edit", { product, suppliers });
                });
        });
});

// UPDATE
router.put("/:id", middleware.isLoggedIn, (req, res) => {
    Product.findByIdAndUpdate(
        req.params.id,
        req.body.product,
        (err, product) => {
            if (err) res.redirect("back");
            req.flash("success", "Product successfully updated");
            res.redirect("/products/" + req.params.id);
        }
    );
});

// DESTROY
router.delete("/:id", middleware.isLoggedIn, (req, res) => {
    Product.findByIdAndDelete(req.params.id, err => {
        if (err) res.redirect("back");
        req.flash("success", "Product deleted");
        res.redirect("/products");
    });
});

module.exports = router;
