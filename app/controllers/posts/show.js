function(params, db){
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/_action/pdxblog/public/main.css" /></head><body>';
	body += '<a href="index">index</a> | <a href="new">new</a> | <a href="/pdxblog/_action/account/login">login</a>';
	body += '<h1>CouchDB Blog</h1>'	;
	
	var post = db.open(params.query["_id"]);
	
	body += '<h2>'+post.title+'</h2>'
	body += '<p>by '+post.author+'</p>'
	body += post.body
	body += '</body></html>'

	
	return {'body': body};
}