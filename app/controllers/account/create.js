function(request, db) {
  //include-lib

	log(request)

	postOnly(request);

	try {
		loggedInOnly(request);
	} catch(e){
		var response = new Response(e.message);
		response.redirect = "/pdxblog/_action/posts/index";
		return response.finalize();
	}

	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));

	var newUser = request.post;

	var response = new Response;

	if (newUser.password == newUser.password_confirmation){
		delete newUser.password_confirmation;
		
		newUser.hashedPassword = secretVersionOf(newUser.password);
		newUser._id = "user:" + newUser.login;
		
		delete newUser.password;
				
		db.save(newUser);
		
		response.body = 'User created! Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
		response.redirect = "/pdxblog/_action/posts/index";
		
	} else {
			
		response.body = 'Password and confirmation do not match. Click <a href="/pdxblog/_action/account/new">here</a> if you are not redirected.';
		response.redirect = "/pdxblog/_action/account/new";
	}
	
	return response.finalize();
};
