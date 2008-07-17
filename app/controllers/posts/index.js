function(request, db){
	//include-lib
	
	log(request)
	
	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<script src="/_utils/script/jquery.js"></script>';
	body += '<script src="/pdxblog/public/main.js"></script>';

	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<ul id="nav"><li><a href="index">index</a></li>';
	              
	if (currentUser){
		body += '<li>logged in as: ' + currentUser + '<li>';
		body += '<li><a href="new">new</a></li>';
		body += '<li><a href="/pdxblog/_action/account/logout">logout</a></li></ul> <br /> ';
	} else {
		body += '<li><a href="/pdxblog/_action/account/login" id="login-link">login</a></li></ul><form id="login" action="/pdxblog/_action/account/login" method="post">                                   ';
  	body += '  <p><label>Username</label>                                                                   ';
  	body += '  <input name="login"></input></p>                                                             ';
  	body += '                                                                                               ';
  	body += '  <p><label>Password</label>                                                                   ';
  	body += '  <input name="password" type="password"></input></p>                                          ';
  	body += '  <p>                                                                                          ';
  	body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" />    ';
  	body += '  </p>                                                                                         ';
  	body += '</form> <br />                                                                                       ';
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