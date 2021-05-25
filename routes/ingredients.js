const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Recipe = require('../models/recipe'),
  Product = require('../models/product'),
  Ingredient = require('../models/ingredient'),
  middleware = require('../middleware')

// NEW
router.get('/new', middleware.checkRecipeOwnership, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) console.log(err)
    Product.find({})
      .sort('name')
      .exec((err, products) => {
        if (err) console.log(err)
        res.render('ingredients/new', { products, recipe })
      })
  })
})

// CREATE
router.post('/', middleware.checkRecipeOwnership, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) res.redirect('/recipes')
    Ingredient.create(req.body.ingredient, (err, ingredient) => {
      if (err) console.log(err)
      recipe.ingredients.push(ingredient)
      recipe.save()
      res.redirect(`/recipes/${recipe._id}/ingredients/new`)
    })
  })
})

// EDIT
router.get('/:ingredient_id/edit', middleware.checkRecipeOwnership, (req, res) => {
  Ingredient.findById(req.params.ingredient_id)
    .populate('product')
    .exec((err, ingredient) => {
      if (err) res.redirect('back')
      Product.find({}, (err, products) => {
        if (err) console.log(err)
        res.render('ingredients/edit', {
          ingredient,
          products,
          recipe_id: req.params.id
        })
      })
    })
})

// UPDATE
router.put('/:ingredient_id', middleware.checkRecipeOwnership, (req, res) => {
  Ingredient.findByIdAndUpdate(req.params.ingredient_id, req.body.ingredient, (err, ingredient) => {
    if (err) res.redirect('back')
    res.redirect('/recipes/' + req.params.id)
  })
})

// DESTROY
router.delete('/:ingredient_id', middleware.checkRecipeOwnership, (req, res) => {
  Ingredient.findByIdAndDelete(req.params.ingredient_id, err => {
    if (err) res.redirect('back')
    req.flash('success', 'Ingredient deleted')
    res.redirect('/recipes/' + req.params.id)
  })
})

module.exports = router
