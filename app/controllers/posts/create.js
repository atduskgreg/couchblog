function(request, db){
	//include-lib
	
	log(request)

	try {
		loggedInOnly(request);
	} catch(e){
		var response = new Response(e.message);
		response.redirect = "/pdxblog/_action/posts/index";
		return response.finalize();
	}

	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);

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
		
		try{
			db.save(doc);
		} catch(e){
			var response = new Response;
			response.body = 'There is already a post by that name. Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';

			response.redirect = '/pdxblog/_action/posts/new'
			return response.finalize();
		}
	};
	

	var response = new Response;

	response.body = 'Post was created. Click <a href="/pdxblog/_action/posts/show?_id='+ doc._id +'">here</a> if you are not redirected.';
	response.redirect = '/pdxblog/_action/posts/show?_id='+ doc._id;
		
	return response.finalize();
	
	
}