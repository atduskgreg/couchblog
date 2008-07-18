function(user){
	if (user._id.match(/user:/) ){
		emit( user._id, user.login );
	}
}