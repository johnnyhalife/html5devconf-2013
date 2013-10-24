var pages = module.exports;

pages.index = function(req, res, next) {
	res.render('index');
};