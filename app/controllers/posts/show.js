function(params, db){
	log(params);
	return db.open(params.post_id);
}