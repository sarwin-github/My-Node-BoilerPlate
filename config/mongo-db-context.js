import session      from 'express-session';
import mongoose     from 'mongoose';
import connectMongo from 'connect-mongo';

const mongoStore = connectMongo(session);

// Local connection
const mongoConnectionLocal = {	
	'url': `mongodb://127.0.0.1:27017/my-database`
};

// Development database from mongolab
const mongoConnectionOnline = {
	'url': `online database connection here`
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const databaseConfig = (env, app) => {
	mongoose.Promise = global.Promise;
	switch (env) {
	    case 'dev':
	    	app.set('port', process.env.PORT || 9003);
	        mongoose.connect(mongoConnectionOnline.url, 
	        	err => { if(err) { console.log(err); }}); 
	        break;
		case 'local':
			let options = {
			  auth: {authdb: 'admin'},
			  user: process.env.MongoDBLocalUser,
			  pass: process.env.MongoDBLocalPassword,
			}

	    	app.set('port', process.env.PORT || 9003);
	        mongoose.connect(mongoConnectionLocal.url, options,  
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

export default databaseConfig;

