function(request, db){
	log(request)

	if (request.verb == "POST"){
		var doc = request.post;
		
		var d = new Date;
		
		var f = function(n) { return n < 10 ? '0' + n : n }
		
		var now = d.getUTCFullYear() + '/' +
	                 			f(d.getUTCMonth() + 1) + '/' +
	                 			f(d.getUTCDate()) + ' ' +
	                 f(d.getUTCHours())     + ':' +
	                 f(d.getUTCMinutes())   + ':' +
	                 f(d.getUTCSeconds()) + " +0000";
	
		doc.published_at = now;
		doc._id = d.getUTCFullYear() + '' + f(d.getUTCMonth() + 1) + '' + f(d.getUTCDate()) + '' + '-' + doc.title.replace(/[^\w\s-]+/g, '').replace(/[-\s]+/g, '-').toLowerCase() ;
		
		db.save(doc);
	}
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head><title></title></head><body>'	
	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/_action/pdxblog/public/main.css" /></head><body>';
	body += '<a href="index">index</a> | <a href="new">new</a> | <a href="/pdxblog/_action/account/login">login</a>';

	body += '<h1>CouchDB Blog</h1>'	
	body += '<p>post was successfully created:<a href="show?_id='+ doc._id +'">view it here</a>.</p>'
	body += '</body></html>'

	return {'body' : body}
	
}