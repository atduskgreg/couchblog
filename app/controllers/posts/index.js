function(params, db){
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head><title></title></head><body>'	
	body += '<h1>CouchDB Blog</h1><ul>'

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