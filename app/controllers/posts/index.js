function(request, db){
	//include-lib
	
	log(request)
	
	if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));
	var currentUser = currentUser(request);
	var doc = db.view("posts/posts-map");
	


		if (currentUser){
    	body += '<a class="edit" href="/pdxblog/_action/posts/edit?_id='+post._id+'">edit</a>';
		};
		
		body += 'posted by <span class="author">'+post.author+'</span>'
		body += ' on <span class="permalink"><a href="show?_id='+post._id+'">'+post.published_at.split(' ')[0] + ' at ' +  post.published_at.split(' ')[1]+'</a></span>'
	
		
		body += '</p>'
		if (post.edits){
			body += '<p class="edits">(edited by'
		
			var edits = [];
			for (editor in post.edits){
				edits.push(' <span class="author">'+editor+'</span> on '+post.published_at.split(' ')[0] + ' at '+ post.edits[editor].split(' ')[1])
			}
			body += edits.join(', ');
			body += ')</p>'
		};
		
		body += '<div class="post">'
		body += post.body
		body += '</div>'
		body += '</li>'
	});
     
	body += '</ul></div>';
	
	//footer:
	body += '<div id="footer">';
	body += '<div class="column">'
	body += '<h4>About</h4>';
	body += '<p>CouchDB Portland was founded in June 2008.</p>'
	body += '</div>'
	
	body += '<div class="column">'
	body += '<h4>Projects</h4>';
	body += '<ul>';
	body += '<li><a href="http://github.com/atduskgreg/couchblog">Couchblog</a> (the software behind this site)</li>'
	body += '</ul>';
	body += '</div>';
	
	body += '<div class="column">'
	body += '<h4>People</h4>';
	body += '<ul><li>Greg</li> <li>Matt</li> <li>Chris</li></ul>'
	body += '</div>'
	
	body += '<br style="clear:both" />';
	body += '</div>';
	
	body += '</div></body></html>'
	
	response = new Response(body)
	return response.finalize();
	
	
}