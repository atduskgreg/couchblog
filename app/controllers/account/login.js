function(params, db) {
  //include-lib

	function currentUser(params) {
		var session = sessionFromCookie(params.cookie);
	}

	function sessionFromCookie(encodedCookies){
		return JSON.parse(decodeURIComponent(encodedCookies.session));
	};
	
	function cookieFromSession(session){
		return 'session=' + encodeURIComponent(JSON.stringify(session)) + "; path=/;"; // expires, etc.
	}
	
	function authenticateSession(session, params){
		if (params.post && params.post.login && (session.hashedLogin == secretVersionOf(params.post.login))){
			return true
		} else {
			throw({message: 'Forbidden: Session couldn\'t be authenticated.', status : 403})
		};
	};
	
	function authenticatedUser(user, params){
		return secretVersionOf(params.post.password) == user.hashedPassword;
	}
	
	function postOnly(params){
		if (params.verb != 'POST') {
			throw({message: 'Method not allowed: POST only.', status : 405})
		}
	}
	
	// TODO: -alerts on response?
	function Response(body){
		this.type = 'body';
		this.body = body;
		
		this.finalize = function() {
			
			var response = {headers : {}};
			response[this.type] = this.body;
			
			if (this.session) {
				authenticateSession(this.session, params);
				response.headers['Set-Cookie'] = cookieFromSession(this.session)
			}
			
			if (this.redirect) {
				response.status = 302;
				response.headers['Location'] = this.redirect;
			}
			 
			return response;
		}
	};
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
