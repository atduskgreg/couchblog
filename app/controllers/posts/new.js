function(params, db){
	var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>';
	body += '<head><title>CouchDB PDX</title>';
	body += '<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" /></head><body>';
	body += '<a href="index">index</a> | <a href="new">new</a> | <a href="/pdxblog/_action/account/login">login</a>';
	body += '<h1>CouchDB Blog</h1>'	;
	
	body += '<h2>Write a new post</h2>'
  body += '<form action="/pdxblog/_action/posts/create" method="post">';
  body += '  <p><label>Title</label>                                  ';
  body += '  <input name="title"></p>                                 ';
  body += '  <p><label>Body</label>                                   ';
  body += '  <textarea name="body"></textarea></p>                    ';
  body += '  <p><label>Author</label>                                 ';
  body += '  <input name="author"></p>                                ';
  body += '  <p>                                                      ';
  body += '  <label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" /> ';
  body += '  </p>                                                     ';
  body += '  <input type="hidden" name="published_at" value="">       ';
  body += '                                                           ';
  body += '</form>                                                    ';

	body += '</body></html>'

	return {'body': body};
}