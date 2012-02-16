var scrappyview = {
	WELCOME: 0,
	LINK_MODE: 2,
	BUSY_SCRAPING: 4,
	CONTENT_MODE:1,
	CONFIRM: 3,
	
	step_num: 1,
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
		"4": "confirm_view",
		"5": "busyscraping_view",
		"disable": "disable"
	},
	
	_addEventHandlers: function(){
		var that=this,
			currview;
		$('.scr_forward').click(function(e){
			var view_num = parseInt($(e.currentTarget).closest(".scr_slide").attr("view"));
			var success = that[that.view_map[view_num]].unrender(that);
			if($(this).hasClass("disabled")){
				return;
			}
			console.log("success: "+ success);
			if(success){
				view_num++;
				that[that.view_map[view_num]].render(that);
				console.log("view "+view_num+": "+that.view_map[view_num]);
				$('.scr_slider').attr('class', 'scrappy_sidebar scr_slider scr_s'+view_num);
			}else{
				return;
			}
			that.step_num = view_num;
			datamgr.save(view_num.toString(),datamgr.STATE);
		});
		$('.scr_back').click(function(e){
			var view_num = parseInt($(e.currentTarget).closest(".scr_slide").attr("view"));
			var success = that[that.view_map[view_num]].unrender(that,true);
			if(success){
				view_num--;
				that[that.view_map[view_num]].render(that);
				console.log("clicked back");
				$('.scr_slider').attr('class', 'scrappy_sidebar scr_slider scr_s'+view_num);
			}else{
				return;
			}
			that.step_num=view_num;
		});
		$("#scr_link_selection").click(function(){
			scrapemgr.startLinkSelectionMode();
		});
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
		
		$(".scr_filetype input").click(function(e){
			var checkbox = $(e.currentTarget).find("input"),
				list = $(e.currentTarget).closest("ul"),
				checked=list.find("input:checked");
			if(checked.length>0){
				$(".scr_scrape").removeClass("scr_disabled");
			}else{
				$(".scr_scrape").addClass("scr_disabled");
			}
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
	getstarted_view: {
		render: function(controller){
			$("#scrappy_title").html("Scrappy - Welcome!");
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
				console.log("Contented save success = "+ success)
				if(success){
					scrapemgr.disableSuggest();
				}else{
					return false;
				}
			}
			return true;
		}
	},
	link_view: {
		render: function(controller){
			scrapemgr.disableSuggest();
			$("#scrappy_title").text("Scrappy - Link Selection");
			return true;
		},
		unrender: function(closed){
			return true;
		}
	},
	confirm_view: {
		render: function(controller){
			$("#scrappy_title").text("Scrappy - Ready to Scrape");
		},
		unrender: function(closed){
			var file_type_str = "";
			if(closed){ return true;}
			$(".scr_filetype input:checked").each(function() {
				file_type_str+=$(this).val()+" ";
			});
			if(file_type_str ==""){
				alert("No file type selected");
				return false;
			}
			datamgr.save(file_type_str,'scrape');
		}
	},
	busyscraping_view:	{
		render: function(controller){
			$("#scrappy_title").text("Scrappy - Scraping");
			controller.progressBar.add();
			var busy_scraping_anim = function(){
				var $elem = $("#progress_text");
				if($elem.attr("scrfaded")===undefined){
					$elem.css("opacity","0");
					$elem.attr("scrfaded","faded");
				}else{
					$elem.css("opacity","100");
					$elem.removeAttr("scrfaded");
				}
				setTimeout(busy_scraping_anim,1500);
			};
			var $elem = $("#progress_text");
			$elem.css("opacity","0");
			$elem.attr("scrfaded","faded");
			busy_scraping_anim();
		},
		unrender: function(closed){
			return true;
		}
	},
	disable:function(calledFromContentScript){
		var currview = this.view_map[String(this.step_num)];		
		console.log('[scrappy.js] disabledAddon (calledFromContentScript = ' + calledFromContentScript + ')');
		this[currview].unrender(this,true);
		$(this.selectors.SB).slideUp(this.SLIDE_SPEED);	
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
				//Add Progressbar
				$("#scrappy_progressbar").progressbar({
					value: 0
				});
				this.updateView(Math.floor(Math.random()*100));	
				
				/*
				//For debugging
				$('body').append('<div id="progressBarBtn" class="scrappy_sidebar" style="width:100px;height:100px;background-color:red"click</div>');
				$('#progressBarBtn').click(function(){
					console.log('clicked progress bar button');
					console.log('right after print click');
					updateView(Math.floor(Math.random()*100));			
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
