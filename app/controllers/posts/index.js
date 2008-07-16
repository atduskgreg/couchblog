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
		log(session)
		session.signature = secretVersionOf(JSON.stringify(signableSession(session)));
		return session;
	}
	
	function authenticateSession(session){
		log("to be authenticated");
		log(session)
		if ( session.signature && (secretVersionOf(JSON.stringify(signableSession(session))) == session.signature)) {
			log("session is authentic");
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
	
	log(params)
	
	if(params.cookie.session) authenticateSession(sessionFromCookie(params.cookie));
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

	// get all the posts
	var doc = db.view("posts/posts-map");
	
	doc.rows.reverse().forEach(function(row){
  	var post = row.value;
    body += '<li><h2>'+post.title+'</h2>'
		body += '<p>by '+post.author+'</p>'
		body += '<p class="permalink"><a href="show?_id='+post._id+'">'+post.published_at.split(' ')[0] + ' at ' +  post.published_at.split(' ')[1]+'</a></p>'
		body += post.body
		body += '</li>'
	});
     
	body += '</ul></body></html>'
	
	response = new Response(body)
	return response.finalize();
	
	
}