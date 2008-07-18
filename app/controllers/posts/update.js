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
	
	postOnly(request);


	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);

	var existingDoc = db.open(request.post._id);
	
	var newDoc = request.post;
	newDoc._rev = existingDoc._rev;
	newDoc.author = existingDoc.author; // don't change the author.
	
	newDoc.edits = existingDoc.edits || {}
	
	newDoc.edits[currentUser] = now();

	log(newDoc);
	
	try{
		db.save(newDoc);
	} catch(e){
		log(e.message);
		var response = new Response;
		response.body = 'Could not save your post. Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
	
		response.redirect = '/pdxblog/_action/posts/edit?_id='+request.post._id;
		return response.finalize();
	}
	

	var response = new Response;

	response.body = 'Post was created. Click <a href="/pdxblog/_action/posts/show?_id='+ newDoc._id +'">here</a> if you are not redirected.';
	response.redirect = '/pdxblog/_action/posts/show?_id='+ newDoc._id;
		
	return response.finalize();
	
	
}