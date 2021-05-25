const express = require('express'),
  router = express.Router(),
  Recipe = require('../models/recipe'),
  middleware = require('../middleware'),
  Comment = require('../models/comment'),
  Ingredient = require('../models/ingredient')

// INDEX
router.get('/', (req, res) => {
  Recipe.find({}, (err, recipes) => {
    if (err) console.log(err)
    res.render('recipes/index', { recipes })
  })
})

// NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('recipes/new')
})

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  const newRecipe = req.body.recipe
  if (newRecipe.image === '')
    newRecipe.image =
      'https://images.unsplash.com/photo-1547516508-4c1f9c7c4ec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
  Recipe.create(newRecipe, (err, recipe) => {
    if (err) console.log(err)
    recipe.author.id = req.user._id
    recipe.author.username = req.user.username
    recipe.save()
    res.redirect('/recipes/' + recipe._id)
  })
})

// SHOW
router.get('/:id', (req, res) => {
  Recipe.findById(req.params.id)
    .populate({
      path: 'ingredients',
      populate: { path: 'product' }
    })
    .exec((err, recipe) => {
      if (err) console.log(err)
      Recipe.findById(req.params.id)
        .populate('comments')
        .exec((err, recipeWithComments) => {
          if (err) console.log(err)
          let recipeTotalCost = 0
          recipe.ingredients.forEach(ingredient => {
            recipeTotalCost += ingredient.costForRecipe()
          })
          res.render('recipes/show', {
            recipe,
            recipeWithComments,
            recipeTotalCost
          })
        })
    })
})

// EDIT
router.get('/:id/edit', middleware.checkRecipeOwnership, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) res.redirect('/recipes')
    res.render('recipes/edit', { recipe })
  })
})

// UPDATE
router.put('/:id', middleware.checkRecipeOwnership, (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, recipe) => {
    if (err) res.redirect('/recipes')
    res.redirect('/recipes/' + req.params.id)
  })
})

// DESTROY
router.delete('/:id', middleware.checkRecipeOwnership, (req, res) => {
  Recipe.findById(req.params.id, (err, recipe) => {
    if (err) {
      req.flash('error', 'Recipe not found')
      res.redirect('back')
    } else {
      Comment.remove(
        {
          _id: {
            $in: recipe.comments
          }
        },
        err => {
          if (err) {
            res.redirect('back')
            req.flash('error', 'Unable to delete comments')
          }
        }
      )
      Ingredient.remove(
        {
          _id: {
            $in: recipe.ingredients
          }
        },
        err => {
          if (err) {
            res.redirect('back')
            req.flash('error', 'Unable to delete ingredients')
          }
          recipe.remove()
          req.flash('success', 'Recipe deleted')
          res.redirect('/recipes')
        }
      )
    }
  })
})

module.exports = router
