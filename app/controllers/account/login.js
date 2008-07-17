function(request, db) {
  //include-lib

	var response = new Response;

	log(request);

	postOnly(request);
	
	var user = db.open('user:'+request.post.login);
	
	if (user && authenticatedUser(user, request)) {
		response.session = {
			login : request.post.login, 
			hashedLogin : secretVersionOf(request.post.login)
		}
		
		response.body = 'Login successful! Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
		response.redirect = '/pdxblog/_action/posts/index';

	} else {
		response.body = 'Bad username or password. Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
		response.redirect = '/pdxblog/_action/posts/index';
	}
	
	log(response.finalize());
	
	return response.finalize()
	


};
