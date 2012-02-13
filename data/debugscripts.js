$('.scr_forward').click(function(e){
	console.log($(e.currentTarget).closest(".scr_slide"));
	var view_num = int($(this).closest(".slide").attr("view"));
	console.log(view_num);
	$('.scr_slider').attr('class', 'scrappy_sidebar scr_slider scr_s'+(view_num+1));
});