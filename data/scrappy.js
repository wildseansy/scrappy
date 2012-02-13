	const instructions = '<p class="scrappy_sidebar">Welcome to Scrappy the web scraper!\
	Using Scrappy, you can gather data from the web in three short steps. </p>\
	<p class="scrappy_sidebar"><b>Step 1: Find a page -</b><div/> Navigate to a website that you wish to scrape and then click continue.';
	const link_inst = '<p class="scrappy_sidebar"><b>Step 3: Get URLs to scrape -</b><div/> Go to a page that lists many links to pages analagous to your examples.</p>';
	const ready_inst = '<p class="scrappy_sidebar">Awesome! You\'re ready to scrape!</p>';
	const content_inst ='<p class="scrappy_sidebar"><b>Required:</b> Then please click on the on content that you wish to scrape.</p>';
	
self.on('message', function(status){
	if(status == '0' || status == '1' || status == '2'||status == '3'||status=='4'){
		scrappyview.init();
		var currview = scrappyview.view_map[status];
		scrappyview[currview].render();
	}else if(status == 'disable'){
		scrappyview.disable(false);
	//message = scrape_progress_52
	}else if(status.substring(0,16) == 'scrape_progress_'){
		updateScrapeProgress(status);
	}else alert(status);
});


	//Main Init - sidebar function
	function scrappyInit(status) 
	{			
		currMode = parseInt(status);
		//TODO: use status to take the correct action (o/c)
		openSidebar();				
	}
	
	//When the user clicks to close the sidebar
	function disableAddon(calledFromContentScript)
	{
		console.log('[scrappy.js] disabledAddon (calledFromContentScript = ' + calledFromContentScript + ')');
		
		//Removes elements and handlers
		$("#scrappySB").remove();
		scrapeview.disableSuggest();
		closeProgressBar();
		if(calledFromContentScript){ 
			datamgr.save('',datamgr.ADDON_DISABLED);
		}
	}
	
	//Creates the sidebar and adds it to the DOM
	function openSidebar()
	{			
		scrappyview.init();		
		addHandlersToSidebarElements();
		prepareDOMForParsing();
	}
	
	
	function addProgressBar()
	{	
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
	}
	
	//updates progress
	function updateScrapeProgress(status)
	{
		//scrape_progress_18
		percentComplete = status.substring(16);
		if(percentComplete < 0 || percentComplete > 100) error();
		else updateProgressBar(parseInt(percentComplete));
	}
	
	//Takes in an int
	function updateProgressBar(percentComplete)
	{
		console.log('');
		console.log('[updateProgressBar] updating progress bar, value = ' + percentComplete);
		console.log('');		
		$("#scrappy_progressbar").progressbar("value",percentComplete);
	}
	
	function closeProgressBar()
	{
		$('#scrape_progress').remove();
	}
	
	
	function prepareDOMForParsing(){
		
		var objects = document.evaluate("//body//*", document, null, XPathResult.ANY_TYPE, null);
		var thisObj = objects.iterateNext();
		
		var toEdit = new Array();
		var i = 0;
		
		while (thisObj) {
			
			var elemIndex = $(thisObj).html().trim().indexOf("<");
			
			if(elemIndex > 0){
				toEdit[i] = thisObj;
				i++;
			}
  			thisObj = objects.iterateNext();
		}
		
		
		for(var i = 0; i < toEdit.length; i++){
			var obj = toEdit[i];
			var elemIndex = $(obj).html().indexOf("<");
			var newHtml = "<span>" + $(obj).html().substring(0, elemIndex) + "</span>" + $(obj).html().substring(elemIndex);
			$(obj).html(newHtml);
		}		
		
	}
		
	function hasChildElements(root, childType)
	{
		return $(root).find(childType).size() > 0;
	}
	
	//Two hueristics - if it contains a table
	//if it contains a div in a div
	function isStructuralTable(table)
	{
		if( $(table).find("table").size() > 0) return true;
		if( $(table).find("div > div").size() > 0) return true;
		
		return false;
	}
	
	//Checks if the element has a parent which is a table in kept
	function keptParentTable(element,kept)
	{
		var parentTables = $(element).parents("table");
		var keptParentTables = $(kept).filter(parentTables).size();			
		return keptParentTables > 0;
	}
	
	//Is the selection an element marked for scraping?
	function isSelectedGood(element)
	{
		return $(element).hasClass(CLASS_GOOD);
	}
	
	//Is the selection an element we suggested user scrape?
	function isSelectedSuggestion(element)
	{
		return $(element).hasClass(CLASS_SUGGESTION);
	}
	
	function addSelectionToUI(title, element){
		/*if(element.length>20)
			summaryString = string.substring(0, 20)+"...";
		else summaryString = element;*/
		$("#scrappySelectedElems").append("<li class='scrappy_sidebar'><span class='scrappy_sidebar scrappy_selected'>"+title+"</span></li>");
		
		//+": "+ summaryString+"</div><br/>");
	}
	//Prompts the user to add an id to the element, adds id
	function addScrappyId(element)
	{		
		var id = getIdFromUser();
		//for right now just use a number name
		if (id != null){
			addSelectionToUI(id, element)
			$(element).attr(ID_NAME,counter);
			$(element).attr('title', "Field Name: " + id);
		}
		return id;
	}
	
	//Removes the id from element and 
	function removeScrappyId(element)
	{
		$(element).removeAttr(ID_NAME);
		$(element).attr('title', "Element Not Selected");
	}
	
	function getIdFromUser()
	{
		var name = prompt("Name this Data Field");
		return name;
	}
	
	//Checks whether the element has been suggested or cliced on by the user (active)
	function isActiveElement(element)
	{
		return $(element).hasClass(CLASS_GOOD) || $(element).hasClass(CLASS_SUGGESTION);
	}
	
	function getElementText(element)
	{
		return $(element).text();
	}
	
	function saveContentTemplate()
	{
		var objects = Array();
		var i = 0;
		$("[" + ID_NAME + "]").each( function() {
			var object = {};
			var name = $(this).attr('title').split(":")[1].trim();
			object['name'] = name;
			var path = xpathutil.getElement($(this)[0]);
			object['path'] = path;
			if($(this)[0].tagName == "TABLE"){
				object['type'] = TABLE_TYPE;
				object['cols'] = $(this).attr('cols');
			} else {
				object['type'] = DEFAULT_TYPE;
			}
			objects[i] = object;
			i++;
		});
		if(objects.length == 0)
		{
			alert('Please choose some elements on the page to scrape');
			return false;
		}
		
		datamgr.save(objects,datamgr.CONTENT);
		return true;
	}
	
	/* syncronously loads another page to serve as a template */
	function getPage(url)
	{
		/*
		jQuery.ajax({
			url:	url,
			success:function(result) {
						return "HTML: " + result;
					},
			async:   false,
			type: "GET",
			dataType: "html"
		});
		*/
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", url, false);
		xmlhttp.setRequestHeader("Content-type", "text/html");
		xmlhttp.setRequestHeader("Connection","Keep-Alive");
		xmlhttp.send();
		return xmlhttp.responseText;
	}


/*
 ----------------------------------------------------------
Functions to start content template mode
----------------------------------------------------------
 */	
		
	function normalButtonInit(id){
		$('#'+id).css("cursor","pointer");
		$("#"+id).mouseover(function() {
		$("#"+id).css("background-color","#383838");
		$("#"+id).css("color","#FFFFFF");
	}).mouseout(function(){
		$("#"+id).css("color","#585858");
		$("#"+id).css("background-color","#D8D8D8");
		});
	}
	function urlTextAreaInit(){
		$("#scrappy_example_URL").submit(function(){
			url=$("#scrappy_example_URL input:first").val();
			abbrev = $("#scrappy_example_URL input:first").val();
			start = 0;
			if(url.indexOf("http://www.", 0)>=0) start=11;
			else if(url.indexOf("http://", 0)>=0) start=7;
			console.log('[urlTextAreaInit]' + start);
			if(abbrev.length-start>40) abbrev=abbrev.substring(start,40)+"...";
			$("#scrappy_example_URL").html("Helper URL:<br\><a id='saved_suggest_URL' class='scrappy_sidebar' href='"+url+"'>"+abbrev+"</a>");
			scrapeview.disableSuggest();
			startContentTemplateMode();
			return false;
		});
	}


	function toggleButtonInit(id){
		$("#"+id).mouseover(function() {
		$("#"+id).css("color","#FFF");
	}).mouseout(function(){
		$("#"+id).css("color","#C0C0C0");
	});
	$('#'+id).css("cursor","pointer");
	}

	function initCloseButton(){
		$("#scrappyTitleBar").append('<div id="scrappyClose" title="Close" class="scrappy_sidebar toggle_button">x</div>');
		$("#scrappyClose").click(function(){
			disableAddon(true);						
		});
		toggleButtonInit("scrappyClose")
	}
	function initMinButton(){
		$("#scrappyTitleBar").append('<div id="scrappyMin" title="Minimize Scrappy" class="scrappy_sidebar toggle_button">_ </div>');
		$("#scrappyMin").click(function(){
			$('#scrappySB').hide();
			$('#scrappyMinDiv').show();
		});
		toggleButtonInit("scrappyMin");
	}
	function initMaxButton(){
		$('body').append('<div id="scrappyMinDiv" title="Maximize Scrappy" style="color:#C0C0C0;display:none;" class="scrappy_sidebar scrappy_topBar">+</div>');
		$("#scrappyMinDiv").click(function(){
			$('#scrappySB').show();
			$('#scrappyMinDiv').hide();
		});
		toggleButtonInit("scrappyMinDiv");
	}
	
	function display_state(){
		$("#scrappy_file_type").hide();
		$("#scrappySelectedElemsDiv").hide();
		$("#scrappy_link-ready").hide();
		$("#scrappy_example_URL").hide();
		$("#scrappy_back").show();
		$("#scrappy_inst").show();
		if(currMode == WELCOME){
				$("#scrappy_title").html("Scrappy - Welcome!");
				$("#scrappy_inst").html(instructions);
				$("#scrappy_back").hide();					
			}
		else if(currMode == CONTENT_MODE)
			{
				$("#scrappy_title").html("Scrappy - Template Creation");
				$("#scrappy_inst").html(content_inst);
				$("#scrappy_example_URL").show();
				startContentTemplateMode();	
			}
			else if (currMode == LINK_MODE)
			{
				scapeview.disableSuggest();
				$("#scrappy_link-ready").show();
				
				$("#scrappy_title").html("Scrappy - Link Selection");
				$("#scrappy_ok-button").html("Continue &gt;&gt;");
				$("#scrappy_inst").html(link_inst);
				//Now selection mode is started by link-ready button
				//startLinkSelectionMode();
			}
			else if (currMode == CONFIRM)
			{
				$("#scrappy_title").html("Scrappy - Ready to Scrape");
				$("#scrappy_file_type").show();
				$("#scrappy_ok-button").html("Scrape!");
				$("#scrappy_inst").html(ready_inst);
				
			}
			else if(currMode == BUSY_SCRAPING)
			{
				$("#scrappyMenu").html("<p class='scrappy_sidebar'>Busy scraping...</p>");
			}
			else
			{
				alert('error');
				error();
			}
	}
	
	function commit_data(){
			
			if(currMode == WELCOME) currMode++;
			else if(currMode == CONTENT_MODE)
			{
				success = saveContentTemplate();		
				if(success){
					currMode++;
				}else return;
			}
			else if (currMode == LINK_MODE)
			{
				success = saveLinkData();
				if(success){
					currMode++;
				} else return;
			}
			else if (currMode == CONFIRM)
			{
				file_type_str = "";
				$("#scrappy_file_type input:checked").each(function() {
					file_type_str+=$(this).val()+" ";
				});
			if(file_type_str ==""){
				alert("No file type selected");
				return false;
			}
				addProgressBar();
				datamgr.save(file_type_str,'scrape');					
				//alert("Scraping...this may take a couple minutes");
				currMode++;
			}
			else
			{
				alert('error');
				error();
			}
			display_state();
	}
	
	
/*
 ----------------------------------------------------------
 Text Processing Functions for Suggestions
 ----------------------------------------------------------
 */
		
		function htmlEntityDecode(str) {
  			var ta = content.document.createElement("textarea");
  			ta.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  			return ta.value;
		}
		
		function getOddCharCount (str) {
			var count = str.split(/&|"|;|=/g).length - 1;
			return count;
		}
		
		function longestWordLength(str) {
			var max = 0;
			var processed = str.split(/\s+/g);
			for(var index in processed){
				snippet = processed[index];
				if(snippet.length > max){
					max = snippet.length;
				}
			}
			return max;
		}
		
		function getObjectText(obj){
			var text = obj.innerHTML;

			var elemIndex = text.indexOf("<");
			if(elemIndex != -1){
				text = text.substring(0, elemIndex);
			}
			
			var processedText = this.htmlEntityDecode(text).replace(/^\s+|\s+$/g,"");
			
			return processedText;
		}