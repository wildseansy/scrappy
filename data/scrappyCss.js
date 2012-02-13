$('head').append('<style type="text/css">\
.scrappy_sidebar p {\
	margin:0px 0 10px 0;\
}\
.scrappy_highlight_good, .scrappy_highlight_suggest\
{\
	border-radius:6px;\
	border-width: 3px;\
	border-style: solid;\
}\
.scr_forward, .scr_back{\
	position:absolute;\
}\
.scr_clickable{\
	cursor:pointer;\
}\
.scr_clickable:hover{\
	background-color:#AAA;\
}\
\
.scr_navigation{\
	height: 20px;\
	position:relative;\
}\
.scr_forward{\
	right:5px;\
}\
.scr_back{\
	left:5px;\
}\
.toggle_button{\
	color:#C0C0C0;\
	display:inline;\
	cursor:pointer;\
}\
#scrappySB\
{\
	position:fixed;\
	color:	#585858;\
	left:0px;\
	border-radius: 3px;\
	top:0px;\
	width:190px;\
	z-index:2147483640;\
	background-color:grey;\
}\
.scrappy_sidebar .scr_step{\
	font-size:11px;\
	text-shadow: 0.09em 0.09em #AAA;\
	font-weight: bold;\
}\
.scrappy_sidebar a:hover, .scrappy_sidebar a:active {\
    color: #447BC4;\
    text-decoration: underline;\
}\
.scrappy_selected\
{\
	border-radius: 6px;\
	padding:2px 4px 2px 4px;\
	background-color:#009933;\
	color: white;\
}\
.scr_slide{\
	text-align:left;\
	border-radius:5px;\
	background:	#D8D8D8;\
}\
.scr_slide .scr_content{\
	padding:8px;\
	position:relative;\
}\
.scr_small_text{\
	font-size:8px;\
}\
#scrappyMenu{\
	padding:8px;\
}\
#scrappyMenu ol{\
	padding-left:20px;\
}\
#ScrappyTitleBar \
{\
	text-align:left;\
	background-color:#585858;\
	font:11px arial,sans-serif;\
	color: #C0C0C0;\
	margin:0px;\
	padding: 4px;\
}\
\
#scrappyMinDiv{\
	position:fixed;\
	padding:3px;\
	left:0px;\
	top:0px;\
}\
#scrappyMin, #scrappyClose{\
	float:right;\
}\
.scrappy_highlight_good\
{\
	background-color:#88f975;\
	border-color: #01920b;\
}\
.scrappy_highlight_suggest\
{\
	background-color:#FFE066;\
	border-color:  #FF9900;\
}\
.scrappy_sidebar\
{\
	font:11px arial,sans-serif;\
}\
\
.scrappy_transparent\
{\
	filter: alpha(opacity=40);\
	opacity: 0.4;\
}\
a.scr_button\
{\
	background:#E8E8E8;\
	display:inline;\
	padding:5px;\
	text-decoration:none;\
	border-radius:3px;\
	width:60px;\
	text-align:center;\
	cursor: pointer;\
}\
a.scr_button:hover\
{\
	background-color:#383838;\
	box-shadow: 1px 2px 2px #000;\
	color: #FFF;\
	text-decoration:none;\
}\
a.scr_scrape:hover\
{\
	background-color:#00FF66;\
	color: #333;\
}\
.scrappy_opaque\
{\
	filter: alpha(opacity=100);\
	opacity: 1;\
}\
input, select, button {\
    border: 1px solid #999999;\
}\
\
.toggle_button:hover\
{\
	color:#FFF;\
}\
.heading{\
	color: #222;\
	text-shadow: white 0.1em 0.1em 0.1em;\
}\
.bold\
{\
	font-size:12px;\
	font-weight:bold;\
}\
.scrappy_hover\
{\
	border-radius: 6px;\
}\
\
.scr_disabled{\
	opacity:.3;\
}\
.scr_disabled:hover{\
	background-color:auto;\
}\
/*Slider CSS*/\
.scr_slider{\
	width:500%;\
	overflow:auto;\
	overflow-x:hidden;\
	-moz-transition: margin .2s ease-out;\
}\
.scr_slider.scr_s1 .scr_slide.scr_s1, .scr_slider.scr_s2 .scr_slide.scr_s2,\
.scr_slider.scr_s3 .scr_slide.scr_s3, .scr_slider.scr_s4 .scr_slide.scr_s4{\
	opacity:1;\
	filter: alpha(opacity=100);\
}\
.scr_slider .scr_slide{\
	width:20%;\
	overflow:auto;\
	overflow-x:hidden;\
	opacity:0;\
	filter: alpha(opacity=0);\
	float:left;\
	-moz-transition: opacity .5s ease-out;\
}\
\
.scr_slider.scr_s2{\
	margin: 0 0 0 -100% !important;\
}\
.scr_slider.scr_s3{\
	margin: 0 0 0 -200% !important;\
}\
.scr_slider.scr_s4{\
	margin: 0 0 0 -300% !important;\
}</style>');