$(function(){
	$("#login-link").bind("click", function(e){
		$("#login-link").parent().css("display", "none")
		$("#login").css("display", "inline");
		return false;
	});
});