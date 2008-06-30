function(request, db){
	

	if (request.verb == "POST"){
		var doc = request.post;
		
		var d = new Date;
		
		var f = function(n) { return n < 10 ? '0' + n : n }
		
		var now = d.getUTCFullYear() + '/' +
                 			f(d.getUTCMonth() + 1) + '/' +
                 			f(d.getUTCDate()) + ' ' +
                 f(d.getUTCHours())     + ':' +
                 f(d.getUTCMinutes())   + ':' +
                 f(d.getUTCSeconds()) + " +0000";
		
		doc.published_at = now;
		doc._id = d.getUTCFullYear() + '' + f(d.getUTCMonth() + 1) + '' + f(d.getUTCDate()) + '' + '-' + doc.title.replace(/[^\w\s-]+/g, '').replace(/[-\s]+/g, '-').toLowerCase() ;
		
		return db.save(doc);
	}
	
}