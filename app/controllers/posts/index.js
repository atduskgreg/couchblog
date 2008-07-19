function(request, db){
  //include-lib
  
  log(request)
  
  if(request.cookie.session) authenticateSession(sessionFromCookie(request.cookie));

	// Resig magic:

	(function(){
	  var cache = {};
  
	  this.tmpl = function tmpl(str, data){
	    // Figure out if we're getting a template, or if we need to
	    // load the template - and be sure to cache the result.
	    var fn = !/\W/.test(str) ?
	      cache[str] = cache[str] ||
	        tmpl(str) :
      
	      // Generate a reusable function that will serve as a template
	      // generator (and which will be cached).
	      new Function("obj",
	        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
	        // Introduce the data as local variables using with(){}
	        "with(obj){p.push('" +
        
	        // Convert the template into pure JavaScript
	        str
	          .replace(/[\r\t\n]/g, " ")
	          .split("<%").join("\t")
	          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	          .replace(/\t=(.*?)%>/g, "',$1,'")
	          .split("\t").join("');")
	          .split("%>").join("p.push('")
	          .split("\r").join("\\'")
	      + "');}return p.join('');");
    
	    // Provide some basic currying to the user
	    return data ? fn( data ) : fn;
	  };
	})();
	
	var currentUser = currentUser(request);
	var doc = db.view("posts/posts-map");
  
	var t = (<r><![CDATA[ 
		<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"><html>
		<head>
			<title>CouchDB PDX</title>
			<script src="/_utils/script/jquery.js"> </script>
			<script src="/pdxblog/public/main.js"> </script>
			<link rel="stylesheet" type="text/css" charset="utf-8" href="/pdxblog/public/main.css" />
		</head>
		<body>
		<div id="body">
			<div id="header">
				<img src="/pdxblog/public/couchdb-pdx-header.png" />
				<ul id="nav">
					<li><a href="/pdxblog/_action/posts/index">home</a></li>
					<li><a href="http://groups.google.com/group/couchdb-pdx/">mailing list</a></li>
				<% if (currentUser) { %>
					<li>logged in as: <%= currentUser %><li>
					<li><a href="/pdxblog/_action/posts/new">write post</a></li>
					<li><a href="/pdxblog/_action/account/new">add user</a></li>
					<li><a href="/pdxblog/_action/account/logout">logout</a></li>
				</ul>
				<% } else { %>
					<li><a href="/pdxblog/_action/account/login" id="login-link">login</a></li>
					<li><form id="login" action="/pdxblog/_action/account/login" method="post">
								<label>Username</label> 
								<input name="login"></input> 
								
								<label>Password</label>                         
								<input name="password" type="password"></input> 
								
								<label class="submit">&nbsp;</label><input class="submit" type="submit" value="submit" />
							</form>
					</li>
				</ul>  
				<% } %>
 			</div>
  		<div id="main">
				<ul>
				<% for(var i = 0; i < posts.length; i++ ) { %>
					<% var post = posts[i].value; %> 
					<li>
					<h2><%= post.title %></h2>
							<p class="attribution">
						<% if (currentUser) { %>
							<a class="edit" href="/pdxblog/_action/posts/edit?_id=<%= post._id %>">edit</a>
						<% }  %>
							posted by <span class="author"><%= post.author %></span>
							on <span class="permalink"><a href="show?_id=<%= post._id %>"><%= post.published_at.split(' ')[0] + ' at ' +  post.published_at.split(' ')[1] %></a></span>
						</p>
					<% if (post.edits) { %>
						<p class="edits">(edited by
						<% for (editor in post.edits){ %>
							<span class="author"><%= editor %></span> on <%= post.edits[editor].split(' ')[0] + ' at ' + post.edits[editor].split(' ')[1] %>
						<% } %>
						)</p>
					<% } %>
					<div class="post">
						<%= post.body %>
					</div>
					</li>
					
				<% } %>
				</ul>
			</div>
			<div id="footer">
				<div class="column">
					<h4>About</h4>
				  <p>CouchDB Portland was founded in June 2008.</p>
			 </div>
  
		  <div class="column">
			  <h4>Projects</h4>
			  <ul>
				  <li><a href="http://github.com/atduskgreg/couchblog">Couchblog</a> (the software behind this site)</li>
			  </ul>
		  </div>
  
		  <div class="column">
			  <h4>People</h4>
			  <ul><li>Greg</li> <li>Matt</li> <li>Chris</li></ul>
		  </div>
  
		  <br style="clear:both" />
	  </div>
  
  </div>
</body>
</html>
	

	]]></r>).toString();

	var rendered = tmpl(t, {currentUser : currentUser, posts : doc.rows.reverse()});
  
  response = new Response(rendered)
  return response.finalize();
  
  
}