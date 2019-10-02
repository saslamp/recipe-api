const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb+srv://sadiq:KszorR10J4yXQWoa@cluster0-m613z.mongodb.net/test?retryWrites=true&w=majority')
	.then(() => console.log('connected to Mongodb Atlas!'))
	.catch((err) => console.error(err))

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/recipes', (req, res, next) => {
	const recipe = new Recipe({
			title: req.body.title,
		    ingredients: req.body.ingredients,
		    instructions: req.body.instructions,
		    difficulty: req.body.difficulty,
		    time: req.body.time,
		})
		recipe.save().then(
			() => res.status(201).json({ message: 'Recipe added'})
		).catch((err) => {
			res.status(400).json({error: error})
		})
});

app.get('/api/recipes', (req, res, next) => {
	Recipe.find().then(
		(recipes) => {
			res.status(200).json(recipes)
		}).catch(
		(err) => {
			res.status(404).json({error: err})
		})
});

app.get('/api/recipes/:id', (req, res, next) => {
	Recipe.findOne({_id: req.params.id}).then(
		(recipe) => res.status(200).json(recipe)).catch(
		(err) => res.status(404).json(err))
});

app.put('/api/recipes/:id', (req, res, next) => {
	const recipe = new Recipe({
			_id: req.params.id,
			title: req.body.title,
		    ingredients: req.body.ingredients,
		    instructions: req.body.instructions,
		    difficulty: req.body.difficulty,
		    time: req.body.time,
		})
	Recipe.updateOne({_id: req.params.id}, recipe).then(
		() => res.status(201).json({message: 'recipe updated'})).catch(
		(err) => res.status(400).json({error: err}))
});

app.delete('/api/recipes/:id', (req, res, next) => {
	Recipe.deleteOne({ _id: req.params.id }).then(
		() => res.status(200).json({ message: 'Deleted'})).catch(
		(err) => res.status(404).json({error: err}))
});

module.exports = app;