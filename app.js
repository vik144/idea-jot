const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session')
const bodyParser = require('body-parser');
const passport = require('passport');	
const mongoose = require('mongoose');

//Database config
const db = require('./config/database')

//Define route
const ideaRoute = require('./routes/ideas');
const userRoute = require('./routes/users');

//Passport config
require('./config/passport')(passport);


//Set mongoose promise to global promise
mongoose.Promise = global.Promise;


//Estabilish mongoDB connection using mongoose
mongoose.connect(db.mongoURI)
.then(console.log('MongoDB connection estabilished'))
.catch((err) => console.log(err))

//Use public folder
app.use(express.static(path.join(__dirname,'public')));

//Load the Models
require('./models/Idea');
require('./models/User');


app.use(session({ //session
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


app.use(flash()); //connect-flash

//Method Override middleware
app.use(methodOverride('_method'));


//SETUP HANDLEBARS
app.engine('handlebars',exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



//GLOBAL VARIABLES
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})


//ROUTES
app.get('/', (req,res) => {
	const title = "Hello World!";
	res.render('index', {
		title: title
	});
})

app.get('/about',(req,res) => {
	res.render('about')
})

//Use Idea router
app.use('/ideas', ideaRoute);

//Use users router
app.use('/users', userRoute )

//CREATE SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`👩‍💻 Server started at port: ${port}`);
})