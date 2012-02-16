self.on('message', function(status){
	if(status == '0' || status == '1' || status == '2'||status == '3'||status=='4'){
		scrappyview.init();
	}else if(status == 'disable'){
		scrappyview.disable(false);
	//message = scrape_progress_52
	}else if(status.substring(0,16) == 'scrape_progress_'){
		updateScrapeProgress(status);
	}
});

