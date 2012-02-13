

var scrappyview = {
	WELCOME: 0,
	LINK_MODE: 2,
	BUSY_SCRAPING: 4,
	CONTENT_MODE:1,
	CONFIRM: 3,
	
	SLIDE_SPEED: 200,
	selectors: {
		SB: "#scrappySB",
		backbtn: "#scrappy_back",
		okbtn: "#scrappy_ok-button",
		menu: "#scrappyMenu",
		titlebar: "#scrappyTitleBar"
	},
	init: function()
	{
		var that = this;
		this.$SB = $(this.selectors.SB);
		if(this.$SB.length!==0){
			this.$backbtn = $("#scrappy_back");
			this.$okbtn =$("#scrappy_ok-button");
			this.$SB.slideDown();
			this.$menu = $("#scrappyMenu");
			this.$TB = $("#scrappyTitleBar");
			$('#scrappyMinDiv').hide();
			$("#scrappy_example_URL").hide();
			return;
		}
		$("body").append(scrappyhtml);
		$('.scr_forward').click(function(e){
			var view_num = parseInt($(e.currentTarget).closest(".scr_slide").attr("view"));
			var success = that[that.view_map[view_num]].unrender(that);
			if(success){
				view_num++;
				that[that.view_map[view_num]].render(that);
				console.log(view_num);
				console.log(that.view_map[view_num]);
				$('.scr_slider').attr('class', 'scrappy_sidebar scr_slider scr_s'+view_num);
			}else{
				return;
			}
			datamgr.save(view_num.toString(),datamgr.STATE);
		});
		$('.scr_back').click(function(e){
			var view_num = parseInt($(e.currentTarget).closest(".scr_slide").attr("view"));
			var success = that[that.view_map[view_num]].unrender(that,true);
			if(success){
				that[that.view_map[view_num-1]].render(that);
				$('.scr_slider').attr('class', 'scrappy_sidebar scr_slider scr_s'+(view_num-1));
			}else{
				return;
			}
		});

		//First time opening:
		this._addEventHandlers();
		$("#scrappy_example_URL").hide();
		$("#scrappy_file_type").hide();
		$("#scrappy_link-ready").hide();
		$("#scrappy_back").hide();
		this.$SB.slideDown(this.SLIDE_SPEED);
	},
	view_map:{
		"1": "getstarted_view",
		"2": "template_view",
		"3": "link_view",
		"4": "comfirm_view",
		"5": "busyscraping_view",
		"disable": "disable"
	},
	
	_addEventHandlers: function(){
		var that=this,
			currview;
		$("#scrappyMinDiv").click(function(){
			$('#scrappySB').show();
			$('#scrappyMinDiv').hide();
		});
		$("#scrappyMin").click(function(){
			$('#scrappySB').hide();
			$('#scrappyMinDiv').show();
		});
		$("#scrappyClose").click(function(){
			that.disable(true);						
		});

		$("#scrappy_back").click(function(){
			that.clickBack();
		});
		
		$("#scrappy_ok-button").click(function(){
			that.clickNext();
		});
		
		$("#scrape-button").click(function(){
			datamgr.save('','scrape');
		});
		
		$("#scrappy_link-ready").click(function(){
			scrapemgr.startLinkSelectionMode();
		});
	},
	_urlTextAreaInit: function (){
		$("#scrappy_example_URL").submit(function(){
			url=$("#scrappy_example_URL input:first").val();
			abbrev = $("#scrappy_example_URL input:first").val();
			start = 0;
			if(url.indexOf("http://www.", 0)>=0) start=11;
			else if(url.indexOf("http://", 0)>=0) start=7;
			console.log('[urlTextAreaInit]' + start);
			if(abbrev.length-start>40) abbrev=abbrev.substring(start,40)+"...";
			$("#scrappy_example_URL").html("Helper URL:<br\><a id='saved_suggest_URL' class='scrappy_sidebar' href='"+url+"'>"+abbrev+"</a>");
			scrapemgr.disableSuggest();
			startContentTemplateMode();
			return false;
		});
	},
	//Click Actions:
	clickNext: function(){
		var currview = this.view_map[String(this.step_num)];
		//Clean up anything in old view
		if(this[currview].unrender(this)){
			this.step_num++;
			
			//Prepare new view
			currview = this.view_map[String(this.step_num)];
			console.log("Continue clicked. Step num: "+this.step_num+", rendering: " + currview);
			this[currview].render(this);
			datamgr.save(step_num.toString(),datamgr.STATE);
		}
	},
	clickBack: function(){
		var currview = this.view_map[String(this.step_num)];
		//Clean up anything in old view
		this[currview].unrender(this);
		this.step_num--;
		currview = this.view_map[String(this.step_num)];
		console.log("Back clicked. Step num: "+this.step_num+", rendering: " + currview);
		this[currview].render(this);
		datamgr.save(this.step_num.toString(),datamgr.STATE);
	},
	
	getstarted_view: {
		render: function(controller){
			$(".scrappy_sidebar .heading").text("Step 1: Find a page");
			$("#scrappy_title").html("Scrappy - Welcome!");
			$("#scrappy_inst").html(instructions);
			$("#scrappy_back").hide();	
		},
		unrender: function(controller,forceclose){
			return true;
		}
	},
	template_view: {
		render: function(controller){
			$("#scrappy_title").html("Scrappy - Template Creation");
			scrapemgr.startContentTemplateMode();	
		},
		unrender: function(controller,forceclose){
			if(forceclose===true){
				scrapemgr.disableSuggest();
			}else{
				var success = scrapemgr.saveContentTemplate();
				if(success){
					scrapemgr.disableSuggest();
					controller.$backbtn.hide();
				}else{
					return false;
				}
			}
			return true;
		}
	},
	link_view: {
		render: function(controller){
			//save stuff from last view:
			console.log("link_view");
			scrapemgr.disableSuggest();
			$("#scrappy_link-ready").show();
			$("#scrappy_title").html("Scrappy - Link Selection");
			$("#scrappy_ok-button").html("Continue &gt;&gt;");
			$("#scrappy_inst").html("");
		},
		unrender: function(closed){
			return true;
		}
	},
	confirm_view: {
		render: function(controller){
			console.log("confirm_view");
			$("#scrappy_title").html("Scrappy - Ready to Scrape");
			$("#scrappy_file_type").show();
			$("#scrappy_ok-button").html("Scrape!");
			$("#scrappy_inst").html(ready_inst);
		},
		unrender: function(closed){
			var file_type_str = "";
			$("#scrappy_file_type input:checked").each(function() {
				file_type_str+=$(this).val()+" ";
			});
			if(file_type_str ==""){
				alert("No file type selected");
				return false;
			}

			datamgr.save(file_type_str,'scrape');					
			//alert("Scraping...this may take a couple minutes");
		}
	},
	busyscraping_view:	{
		render: function(controller){
			$("#scrappyMenu").html("<p class='scrappy_sidebar'>Busy scraping...</p>");
			this.progressBar.add();
		},
		unrender: function(closed){
			return true;
		}
	},
	disable:function(calledFromContentScript){
		var currview = this.view_map[String(this.step_num)];
		console.log('[scrappy.js] disabledAddon (calledFromContentScript = ' + calledFromContentScript + ')');
		this[currview].unrender(this,true);
		this.$SB.slideUp(this.SLIDE_SPEED);	
		this.progressBar.close();
		if(calledFromContentScript){
			datamgr.save('',datamgr.ADDON_DISABLED);
		}
	},
	
	progressBar: {
		init: function(){},
		add: function(){	
				console.log('');
				console.log('[addProgressBar] adding progress bar!');
				console.log('');
				
				//Load stylesheet
				$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://stanford.edu/~nikil/progressBar.css') );
				
				//Create Div
				$('body').append('<div id="scrape_blackout"></div>');
				$('body').append('<div id="scrape_progress"><span id="progress_text">Scraping...</span><div id="scrappy_progressbar"></div></div>');
				
				//Background blackout
				$('#scrape_blackout').css("top","0px");
				$('#scrape_blackout').css("left","0px");
				$('#scrape_blackout').css("width","100%");
				$('#scrape_blackout').css("height","100%");
				$('#scrape_blackout').css("background-color","black");
				$('#scrape_blackout').css("opacity",0.7);
				$('#scrape_blackout').css("position","fixed");
				$('#scrape_blackout').css("margin","0px");
				$('#scrape_blackout').css("zIndex",2147483645);
				
				//Progress Box
				$('#scrape_progress').css("position","fixed");	
				$('#scrape_progress').css("top","100px");
				$('#scrape_progress').css("left","300px");
				$('#scrape_progress').css("height","80px");
				$('#scrape_progress').css("width","500px");
				$('#scrape_progress').css("zIndex",2147483646);
				$('#scrape_progress').css("background-color","white");
				$('#scrape_progress').css("text-align","center");
				$('#scrape_progress').css("border","1px solid black");
				
				//Progress Bar			
				$('#scrappy_progressbar').css("margin","auto");
				$('#scrappy_progressbar').css("height","40px");
				$('#scrappy_progressbar').css("width","400px");
				$('#scrappy_progressbar').css("position","relative");
				$('#scrappy_progressbar').css("zIndex",2147483647);		
		
				//Add Progressbar
				$("#scrappy_progressbar").progressbar({
					value: 0
				});
				
				/*
				//For debugging
				$('body').append('<div id="progressBarBtn" class="scrappy_sidebar" style="width:100px;height:100px;background-color:red"click</div>');
				$('#progressBarBtn').click(function(){
					console.log('clicked progress bar button');
					console.log('right after print click');
					updateProgressBar(Math.floor(Math.random()*100));			
					console.log('after clicking progress bar button');
				});*/
			},
	
		//updates progress
		updateProgress: function(status){
			//scrape_progress_18
			percentComplete = status.substring(16);
			if(percentComplete < 0 || percentComplete > 100) error();
			else this.updateView(parseInt(percentComplete));
		},
		
		//Takes in an int
		updateView: function(percentComplete){
			console.log('');
			console.log('[updateProgressBar] updating progress bar, value = ' + percentComplete);
			console.log('');		
			$("#scrappy_progressbar").progressbar("value",percentComplete);
		},
		
		close: function(){
			$('#scrape_progress').remove();
		}
	}
};
