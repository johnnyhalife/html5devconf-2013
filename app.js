var express = require('express'),
		app = express();
		
/** App Configuration Handlers **/
app.configure(function(){
	app.use(express.compress());
	
	app.use("/", express.static(__dirname + '/static'));
  app.use("/static", express.static(__dirname + '/static'));

	// Views
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

	app.use(app.router);
});

/** Routes Handlers **/
var pages = require('./lib/resources/pages');
app.get("/", pages.index);

app.listen(process.env.PORT || 4001);