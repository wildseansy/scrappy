var scrappyhtml = "<div id='scrappyMinDiv' title='Maximize Scrappy' style='color:#C0C0C0;display:none;' class='scrappy_sidebar scrappy_topBar'>+</div>\
<div id='scrappySB' class='scrappy_sidebar'>\
	<div id='scrappyTitleBar' class='scrappy_sidebar'>\
		<span id='scrappy_title' class='scrappy_sidebar'>Scrappy</span>\
		<div id='scrappyClose' title='Close' class='scrappy_sidebar toggle_button'>X</div>\
		<div id='scrappyMin' title='Minimize Scrappy' class='scrappy_sidebar toggle_button'>_&nbsp;</div>\
	</div>\
	<div id='scrappyMenu' class='scrappy_sidebar'>\
		<div class='scr_slider scr_s1 scrappy_sidebar'>\
			<div class='scr_slide scr_s1 scrappy_sidebar' view='1'>\
				<div class='scr_content scrappy_sidebar'>\
					<p class='scrappy_sidebar'>\
						Welcome to Scrappy the web scraper!\
						Using Scrappy, you can gather data from the web in three short steps.\
						<div class='scr_small_text'>For more info visit <a href='http://scrappyscraper.com'>scrappyscraper.com</a></div>\
					</p>\
					<div class='scr_step scrappy_sidebar'>Step 1: </div>\
					<p class='scrappy_sidebar'>Navigate to a website that has content that you wish to scrape, and click continue.</p>\
					<div class='scr_navigation scrappy_sidebar'>\
						<a class='scr_button scr_forward scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s2\')'>Continue &gt;&gt;\
						</a>\
					</div>\
				</div>\
			</div>\
			<div class='scr_slide scr_s2 scrappy_sidebar' view='2'>\
				<div class='scr_content scrappy_sidebar'>\
				<div class='scrappy_sidebar scr_step'>Step 2:</div>\
				<p class ='scrappy_sidebar scrappy_sidebar'>Select elements on the page that you would like to scrape</p>\
				<div class='scr_navigation'>\
					<a class='scr_button scr_back scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s1\')'>&lt;&lt;Back\
					</a>\
					<a class='scr_button scr_forward scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s3\')'>Continue &gt;&gt;\
					</a>\
					</div>\
				</div>\
			</div>\
			<div class='scr_slide scr_s3 scrappy_sidebar' view='3'>\
				<div class='scr_content scrappy_sidebar'>\
				<div class='scrappy_sidebar scr_step'>Step 3: </div>\
				<p class='scrappy_sidebar'>Navigate to a webpage with links you would like to scrape.  Select the links you wish to scrape.</p>\
				<p class='scrappy_sidebar'>You may also enter custom links here, one per line:</p>\
				<textarea rows='3' cols='18'></textarea>\
				<div class='scr_navigation scrappy_sidebar'>\
					<a class='scr_button scr_back scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s2\')'>&lt;&lt;Back\
					</a>\
					<a class='scr_button scr_forward scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s4\')'>Continue &gt;&gt;\
					</a>\
					</div>\
				</div>\
			</div>\
			<div class='scr_slide scr_s4 scrappy_sidebar' view='4'>\
				<div class='scr_content scrappy_sidebar'>\
				Select output types:\
				<ul>\
					<li class='scr_clickable' onclick='var c=$(this).find(\'input\')[0];c.checked=!c.checked;\'><input type=\'checkbox\' name=\'scrappy_file_type\' value=\'csv\' checked=\'true\' />CSV</li>\
					<li class='scr_clickable' onclick='var c=$(this).find(\'input\')[0];c.checked=!c.checked;\'><input type=\'checkbox\' name=\'scrappy_file_type\' value=\'json\'/>JSON</li>\
				</ul>\
				<div class='scr_navigation scrappy_sidebar'>\
					<a class='scr_button scr_back scrappy_sidebar' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s3\')'>&lt;&lt;Back\
					</a>\
					<a class='scr_button scr_forward scr_disabled scrappy_sidebar scr_scrape' onclick='$(\'.scr_slider\').attr(\'class\', \'scrappy_sidebar scr_slider scr_s4\')'>Scrape!\
					</a>\
				</div>\
				</div>\
			</div>\
		</div>\
	</div>\
</div>"