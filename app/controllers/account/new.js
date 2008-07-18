function(request, db) {
  //include-lib

	try {
		loggedInOnly(request);
	} catch(e){
		var response = new Response(e.message);
		response.redirect = "/pdxblog/_action/posts/index";
		return response.finalize();
	}

	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);
	

	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<script src="/_utils/script/jquery.js"></script>';
	body += '<script src="/pdxblog/public/main.js"></script>';

	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<div id="body"><div id="header"><img src="/pdxblog/public/couchdb-pdx-header.png" /><ul id="nav"><li><a href="/pdxblog/_action/posts/index">home</a></li><li><a href="http://groups.google.com/group/couchdb-pdx/">mailing list</a></li>';
              
	body += '<li>logged in as: ' + currentUser + '<li>';
	body += '<li><a href="/pdxblog/_action/posts/new">write post</a></li>';
	body += '<li><a href="/pdxblog/_action/account/new">add user</a></li>';
	body += '<li><a href="/pdxblog/_action/account/logout">logout</a></li></ul>';

	body += '</div>'	;
	body += '<div id="main">'
	body += '<ul>'
	
	body += '<li><h2>Create a new user</h2>'
	body += '<p class="attribution">'
	body += '<span class="warning">Warning</span>: Login must be unique. Current users: '
	
	var users = [];
	
	db.view("users/users-map").rows.forEach(function(row){
		users.push(row.value);
	});
	
	body += users.join(", ") + "."
	
	body += '</p>'
  body += '<form id="new" action="/pdxblog/_action/account/create" method="post">';
  body += '  <p><label>Login</label>                               ';
  body += '  <input name="login"></p>                                 ';
  body += '  <p><label>Password</label>                                   ';
  body += '  <input name="password" type="password"></p>                    ';
  body += '  <p><label>Confirm Password</label>                                   ';

  body += '  <input name="password_confirmation" type="password"></p>                    ';
  body += '  <p>                                                      ';
  body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" /> ';
  body += '  </p>                                                     ';
  body += '                                                           ';
  body += '</form>                                                    ';
	body += '</li></ul></body></html>';

	var response = new Response(body);

	return response.finalize();
}