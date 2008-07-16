function(params, db) {
  //include-lib

	function currentUser(params) {
		if(params.cookie.session){
			return sessionFromCookie(params.cookie).login;
		} else {
			return false
		}
	}

	function sessionFromCookie(encodedCookies){
		return JSON.parse(decodeURIComponent(encodedCookies.session));
	};
	
	function cookieFromSession(session){
		return 'session=' + encodeURIComponent(JSON.stringify(session)) + "; path=/;"; // expires, etc.
	}
	
	function signableSession(session){
		var result = {}
		for (key in session){ 
			if(key != "signature"){ 
				result[key] = session[key]				
			} 
		} 
		return result;
	}
	
	function signSession(session){
		log("to be signed");
		log(signableSession(session));
		session.signature = secretVersionOf(JSON.stringify(signableSession(session)));
		return session;
	}
	
	function authenticateSession(session){
		if ( session.signature && (secretVersionOf(JSON.stringify(signableSession(session))) == session.signature)) {
			return true
		} else {
			throw({message: 'Forbidden: Session couldn\'t be authenticated.', status : 403})
		}
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
				response.headers['Set-Cookie'] = cookieFromSession(signSession(this.session));
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
