const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Bring in the Model
require('../models/Idea')
const Idea = mongoose.model('ideas');
const {ensureAuthenticated} = require('../helpers/auth');


//Form to add ideas

router.get('/add',ensureAuthenticated, (req,res) =>{
	res.render('ideas/add');
});

//Show Ideas route

router.get('/', (req,res) => {
	Idea.find({user: req.user.id}).sort({date: 'desc'}).then(ideas => {
		res.render('./ideas/index', {
			ideas: ideas
		})
	})
	
})

//Edit Ideas route
router.get('/edit/:id',ensureAuthenticated,(req,res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		if(idea.user != req.user.id){
			req.flash('error_msg','You are not authorised');
			res.redirect('/ideas');
		}else{
			res.render('./ideas/edit',{
			idea: idea
		})
		}
		
	})
})

//Process Form
router.post('/',ensureAuthenticated, (req,res) => {
	let errors = [];  //Pushing all errors to an empty array
	if(!req.body.title){
		errors.push({text: 'Please enter a title'});
	}
	if(!req.body.content){
		errors.push({text: 'Please enter some content'});
	} 
	if(errors.length > 0){ //Checking the errors array
		res.render('ideas/add', {
			errors : errors,
			title: req.body.title,
			content: req.body.content
		})
	}else{
		const newIdea = {
			title:  req.body.title,
			content: req.body.content,
			user: req.user.id
		}
		new Idea(newIdea)
		.save()
		.then(idea => {
			req.flash('success_msg','Idea added');
			res.redirect('/ideas');
		})

	}
})

//Edit Ideas route
router.put('/:id',ensureAuthenticated, (req,res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.content = req.body.content;

		idea.save()
		.then(idea => {
			req.flash('success_msg','Idea updated');			
			res.redirect('/ideas');
		})
	})
})

//DELETE ideas
router.delete('/:id',ensureAuthenticated,(req,res) => {
	Idea.remove({
		_id: req.params.id
	}).then(() => {
		req.flash('success_msg','Idea removed')
		res.redirect('/ideas');
	})
});







module.exports = router