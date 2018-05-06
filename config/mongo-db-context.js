const session    = require('express-session');
const mongoose   = require('mongoose');
const mongoStore = require('connect-mongo')(session);

// Local connection
let mongoConnectionLocal = {	
	'url': `mongodb://${process.env.MongoDBLocalUser}:${process.env.MongoDBLocalPassword}@127.0.0.1:27017/my-database`
};

// Development database from mongolab
let mongoConnectionOnline = {
	'url': `mongodb://${process.env.MLabDBUser}:${process.env.MLabDBPassword}@ds113749.mlab.com:13749/my-database`
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	mongoose.Promise = global.Promise;
	switch (env) {
	    case 'dev':
	    	app.set('port', process.env.PORT || 9001);
	        mongoose.connect(mongoConnectionOnline.url, 
	        	err => { if(err) { console.log(err); }}); 
	        break;
		case 'local':
	    	app.set('port', process.env.PORT || 9001);
	        mongoose.connect(mongoConnectionLocal.url, {auth:{authdb:"admin"}},  
	        	err => { if(err) { console.log(err); }});
			break;
	};

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: false, 
		store  : new mongoStore({ mongooseConnection: mongoose.connection }),
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

