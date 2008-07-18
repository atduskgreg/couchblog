function(request, db){
	//include-lib

	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);

	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<script src="/_utils/script/jquery.js"></script>';
	body += '<script src="/pdxblog/public/main.js"></script>';

	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<div id="body"><div id="header"><img src="/pdxblog/public/couchdb-pdx-header.png" /><ul id="nav"><li><a href="index">home</a></li><li><a href="http://groups.google.com/group/couchdb-pdx/">mailing list</a></li>';
	              
	if (currentUser){
	body += '<li>logged in as: ' + currentUser + '<li>';
	body += '<li><a href="/pdxblog/_action/posts/new">write post</a></li>';
	body += '<li><a href="/pdxblog/_action/account/new">add user</a></li>';
	body += '<li><a href="/pdxblog/_action/account/logout">logout</a></li></ul>';
	} else {
		body += '<li><a href="/pdxblog/_action/account/login" id="login-link">login</a></li><li><form id="login" action="/pdxblog/_action/account/login" method="post">                                   ';
  	body += '  <label>Username</label>                                                                   ';
  	body += '  <input name="login"></input></p>                                                             ';
  	body += '                                                                                               ';
  	body += '  <label>Password</label>                                                                   ';
  	body += '  <input name="password" type="password"></input></p>                                          ';
  	body += '                                                                                            ';
  	body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" />    ';
  	body += '                                                                                           ';
  	body += '</form> </li></ul>                                                                                      ';
	}                                     
	                                                                                                        
	body += '</div>'	;
	body += '<div id="main">'
	body += '<ul>'
	
	var post = db.open(request.query["_id"]);
	
	body += '<li><h2>'+post.title+'</h2>'
	body += '<p class="attribution">'
	body += 'posted by <span class="author">'+post.author+'</span>'
	body += ' on <span class="permalink"><a href="show?_id='+post._id+'">'+post.published_at.split(' ')[0] + ' at ' +  post.published_at.split(' ')[1]+'</a></span>'
	body += '</p>'
	body += '<div class="post">'
	body += post.body
	body += '</div>'
	body += '</li></ul></div></div></body></html>'

	response = new Response(body);
	return(response.finalize());
}