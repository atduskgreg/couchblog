function(request, db) {
  //include-lib
	
	// postOnly(request);
	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
		
	var response = new Response;
	
	response.expireSession();
	response.body = 'You have been logged out. Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
	response.redirect = '/pdxblog/_action/posts/index';
	
	
	
	return response.finalize()
	


};
