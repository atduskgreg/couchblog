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
	
	function cookieFromSession(session, expiration, path){
		log("building cookie");
		log(session);
		var cookieValue = 'session=' + encodeURIComponent(JSON.stringify(session));
		if(expiration){
			cookieValue += "; expires=" + expiration;
		};
		
		if(path){
			cookieValue += "; path="+path +";";
		} else {
			cookieValue += "; path=/;";
		};
		
		log(cookieValue);
		
		return cookieValue;
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
		log("logout: to be signed");
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
		if(params.cookie) this.session = sessionFromCookie(params.cookie);
		
		this.expireSession = function(){
			this.session.expires = "Thu, 01 Jan 1970 00:00:00 GMT";
		}
		
		this.finalize = function() {
			
			var response = {headers : {}};
			response[this.type] = this.body;
			
			if (this.session) {
				var exp = this.session.expires;
				delete(this.session.expires); // this makes finalize destructive!
				response.headers['Set-Cookie'] = cookieFromSession(signSession(this.session), exp);
			}
			
			if (this.redirect) {
				response.status = 302;
				response.headers['Location'] = this.redirect;
			}
			 
			return response;
		}
	};
	
	// begin actual action:
	log("LOGOUT");
	log(params);
	
	log("cookie:");
	log(sessionFromCookie(params.cookie));
	// postOnly(params);
	if(params.cookie.session) authenticateSession(sessionFromCookie(params.cookie));
	
	
	var response = new Response;
	// response.expireSession();	
	
	response.expireSession();
	response.body = 'You have been logged out. Click <a href="/pdxblog/_action/posts/index">here</a> if you are not redirected.';
	response.redirect = '/pdxblog/_action/posts/index';
	
	
	
	return response.finalize()
	


};
