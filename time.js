var sys = require('sys'),
		fs = require('fs'),
		Url = require('url'),
    http = require('http'),
		querystring = require('querystring');
    require('./mustache');

var html_template = "<html><head><title>{{title}}</title></head><body>{{{content}}}</body></html>";

var form = function() {return "<div id='container'> \
																<form method='post' action='/addTime'> \
																<ul> \
																	<li> \
																		<label for='element_1'></label> \
																		<div>	<input name='activity' type='text' value=''/> </div> \
																	</li>	\
																	<li> \
																		<input type='submit' name='submit' value='Submit'/> \
																	</li> \
																</ul> \
																</form> \
																</div>"};							
var index_view = { title : "Time", content : form };
var add_time_view = { title : "Time", content : "Success" };

var indexAction = function(req){
	return Mustache.to_html(html_template, index_view);
};

var addTimeAction = function(req){
	var formData = null;
	req.addListener('data', function (post) {			  
		formData = querystring.parse(post.toString());
	 });
	
	fs.open("timesheet.txt", "a", 0666, function(er, fd){
		var timeStamp = Math.round(new Date().getTime() / 1000);
		fs.write(fd, timeStamp+':'+formData['activity']+"\n", null);
	});
	
	return Mustache.to_html(html_template, add_time_view);
};

var router = { "/" : indexAction, "/addTime" : addTimeAction };

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
		var requestPath = Url.parse(req.url).pathname;
		var html = router[requestPath](req);
    res.end(html);
}).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');
