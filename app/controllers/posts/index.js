function(params, db){
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<a href="index">index</a> | <a href="new">new</a>';
	body += '<h1>CouchDB Blog</h1>'	;

	// get all the posts
	var doc = db.view("posts/posts-map");

	
	doc.rows.reverse().forEach(function(row){
  	var post = row.value;
    body += '<li><h2>'+post.title+'</h2>'
		body += '<p>by '+post.author+'</p>'
		body += post.body
		body += '</li>'
	});
	// published_at not included
     
	body += '</ul></body></html>'
	
	return {'body': body};
}