function(params, db) {
  //include-lib

	var response = new Response;

	log(params);

	postOnly(params);
	
	var user = db.open('user:'+params.post.login);
	
	if (user && authenticatedUser(user, params)) {
		response.session = {
			login : params.post.login, 
			hashedLogin : secretVersionOf(params.post.login)
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
