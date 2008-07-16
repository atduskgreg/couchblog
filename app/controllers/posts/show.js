function(params, db){
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
				if (this.session.expires){
					var exp = this.session.expires;
					delete(this.session.expires); // this makes finalize destructive!
				}

				response.headers['Set-Cookie'] = cookieFromSession(signSession(this.session), exp);
			}
			
			if (this.redirect) {
				response.status = 302;
				response.headers['Location'] = this.redirect;
			}
			 
			return response;
		}
	};
	
	var currentUser = currentUser(params);

	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<script src="/_utils/script/jquery.js"></script>';
	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<a href="index">index</a> | <a href="new">new</a>';
	              
	
	if (currentUser){
		body += ' | logged in as: ' + currentUser;
	} else {
		body += '<form action="/pdxblog/_action/account/login" method="post">                                   ';
  	body += '  <p><label>Username</label>                                                                   ';
  	body += '  <input name="login"></input></p>                                                             ';
  	body += '                                                                                               ';
  	body += '  <p><label>Password</label>                                                                   ';
  	body += '  <input name="password" type="password"></input></p>                                          ';
  	body += '  <p>                                                                                          ';
  	body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" />    ';
  	body += '  </p>                                                                                         ';
  	body += '</form>                                                                                        ';
	}                                                                                         

	                                                                                                        
	body += '<h1>CouchDB Blog</h1>'	;
	
	var post = db.open(params.query["_id"]);
	
	body += '<h2>'+post.title+'</h2>'
	body += '<p>by '+post.author+'</p>'
	body += post.body
	body += '</body></html>'

	response = new Response(body);
	
	
	return(response.finalize());
}