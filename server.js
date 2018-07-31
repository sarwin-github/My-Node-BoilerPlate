//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Add the required modules
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import express        from 'express';
import session        from 'express-session';
import validator      from 'express-validator';
import bodyParser     from 'body-parser';
import cookieParser   from 'cookie-parser';
import flash          from 'connect-flash';
import morgan         from 'morgan' ;
import methodOverride from 'method-override';
import helmet         from 'helmet';
import dotEnv         from 'dotenv';
import favicon        from 'serve-favicon';

// Local modules for config
import errorHandler       from './config/error-handler';
import initializeCors     from './config/initialize-cors';
import initializeCSURF    from './config/initialize-csurf';
import initializeVariable from './config/initialize-local-variables';
import initializeRoutes   from './config/routes-initialization';
import databaseConfig     from './config/mongo-db-context';

const app = express();
dotEnv.config();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set database connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const env = process.env.NODE_EN || 'local';
databaseConfig(env, app);
		
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set view engine and session
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Morgan is use for development to test what are the request and response that's being handle
app.use(morgan('dev')); 
// Set helmet
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'The Force' }));
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());

app.use(cookieParser());
app.use(validator()); // Validator is a backend validator by express 
app.use(flash()); // Flash can be use to store messages or notification on session

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs'); ///Set the view engine to EJS
app.set('views', __dirname + '/views'); ///Set the views directory
app.use(express.static(__dirname));
//app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Get the bootstrap, jquery, and font-awesome inside the node_module 
app.use('/js'     , express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js'     , express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css'    , express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/css'    , express.static(__dirname + '/node_modules/selectize/dist/css'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use('/css/'   , express.static(__dirname + '/node_modules/font-awesome/css'));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set locals variable
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => initializeVariable(req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set up CORS
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* Allow CORS*/
initializeCors(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Anti csurf attack protection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* uncomment if you want to add csurf protection, 
   csurf will be stored in cookies and local variable */
initializeCSURF(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
initializeRoutes(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Error Handler
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => errorHandler.getError(req, res, next));
app.use((err, req, res, next) => errorHandler.showError(err, req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create Server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(app.get('port'), () => {
	console.log(`NODE_ENV: ${env}`);
	console.log(`Server Listening to Port: ${app.get('port')}`);
});
