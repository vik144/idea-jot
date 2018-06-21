if (process.env.NODE_ENV === "production"){
	module.exports = {mongoURI: 'mongodb://vik:vik1234@ds261470.mlab.com:61470/ideajot'}
}else {
	module.exports = {mongoURI:'mongodb://localhost/ideajot' }
}
