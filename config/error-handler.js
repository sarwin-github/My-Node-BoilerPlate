const errorHandler = {
	getError: (req, res, next) => {
		let err    = new Error('Page Not Found. Please check your URL address or contact the administrator for further details regarding this error.');
		err.status = 404;
		return next(err);
	},
	showError: (err, req, res, next) => {
		res.locals.message = err.message;
		res.locals.error   = req.app.get('NODE_EN') === 'dev' || 'local' ? err: {};

	  	if(!!err){
		    res.status(err.status || 500);
		    return res.render('error/error.ejs');
	  	}
  	}
}

export default errorHandler;