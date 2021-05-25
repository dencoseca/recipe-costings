// =====================
// REQUIREMENTS
// =====================

// APP
const express = require("express"),
    app = express(),
    PORT = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// IMPORT ROUTES
const recipeRoutes = require("./routes/recipes"),
    ingredientRoutes = require("./routes/ingredients"),
    productRoutes = require("./routes/products"),
    supplierRoutes = require("./routes/suppliers"),
    indexRoutes = require("./routes/index"),
    commentRoutes = require("./routes/comments");

// =====================
// APP CONFIG
// =====================

// DATABASE CONFIG
const databaseName = "recipe_costings";
const loginDetails = process.env.MONGODBLOGIN;

mongoose.connect(
    `mongodb+srv://${loginDetails}@projectdeploycluster-zaz5i.mongodb.net/${databaseName}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
);

// MIDDLEWARE AND ENGINE CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(
    expressSession({
        secret: "the road goes ever on and on",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CUSTOM MIDDLEWARE VARIABLES
app.use((req, res, next) => {
    // pass user as variable for authentication
    res.locals.currentUser = req.user;
    // pass message variable for flash on every page
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
});

// ROUTER CONFIG
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/ingredients", ingredientRoutes);
app.use("/products", productRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use(indexRoutes);

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}...`);
});
