function(doc){
	if ( doc.title && doc.body && doc.author && doc.published_at ){
		emit( doc.published_at, doc );
	}
}