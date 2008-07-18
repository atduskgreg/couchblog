function(request, db){
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
	
	var post = db.open(request.query["_id"]);
	
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<script src="/_utils/script/jquery.js"></script>';
	body += '<script src="/pdxblog/public/main.js"></script>';

	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<div id="body"><div id="header"><img src="/pdxblog/public/couchdb-pdx-header.png" /><ul id="nav"><li><a href="index">home</a></li><li><a href="http://groups.google.com/group/couchdb-pdx/">mailing list</a></li>';
              
	body += '<li>logged in as: ' + currentUser + '<li>';
	body += '<li><a href="/pdxblog/_action/posts/new">write post</a></li>';
	body += '<li><a href="/pdxblog/_action/account/new">add user</a></li>';
	body += '<li><a href="/pdxblog/_action/account/logout">logout</a></li></ul>';

	body += '</div>'	;
	body += '<div id="main">'
	body += '<ul>'
	
	body += '<li><h2>Edit this post</h2>'
	body += '<p class="attribution">'
	body += '<span class="warning">Warning</span>: Permalinks are forever so slug will not change to match new title. Write your own damn markup.'
	body += '</p>'
  body += '<form id="new" action="/pdxblog/_action/posts/update" method="post">';
	body += '  <p><label>Slug: </label> '+ post._id +'</p>                                  ';

  body += '  <p><label>Title</label>                                  ';
  body += '  <input name="title" value="'+post.title+'"></p>                                 ';
  body += '  <p><label>Body</label>                                   ';
  body += '  <textarea name="body">'+ post.body +'</textarea></p>                    ';
  body += '  <p>                                                      ';
  body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" /> ';
  body += '  </p>                                                     ';
  body += '  <input type="hidden" name="_id" value="'+ post._id +'">       ';
  body += '  <input type="hidden" name="published_at" value="'+ post.published_at +'">       ';

  body += '                                                           ';
  body += '</form>                                                    ';
	body += '</li></ul></body></html>';

	var response = new Response(body);

	return response.finalize();
}