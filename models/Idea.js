const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema 

const ideaSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('ideas',ideaSchema);

