var scrapemgr ={
	ID_NAME: 'scrappy_id',
	CLASS_GOOD: 'scrappy_highlight_good',
	CLASS_SUGGESTION: 'scrappy_highlight_suggest',
	CLASS_TRANSPARENT: 'scrappy_transparent',
	CLASS_OPAQUE: 'scrappy_opaque',
	CLASS_INACTIVE_HOVER: 'scrappy_hover',
	counter: 0,
	tableCounter: 0,
	DEBUG: false,
	TABLE_TYPE: "table",
	DEFAULT_TYPE: "default",
	
	prepareDOMForParsing: function(){
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
	},
	getLinkSuggestions: function(){
		var holders = $("table, ul");
		var keep = $(holders).find("a");	
		return keep;
	},
	getSuggestions: function(allTypes, allTypesExceptTable){
		//Get div, table, spans without children
		var elements = $(allTypes);
		var keep = [];
		
		//Filter each element
		
		//Tables - keep tables that dont have other tables in them
		//IDEA TO DO: if the table only has one div / span in each td
		var tables = $(elements).filter("table");
		for(var i=0; i < tables.size(); i++)
		{
			if(!this._isStructuralTable(tables[i])) 
				keep[keep.length] = tables[i];
		}
					
		//Divs - Keep divs with no children div, spans, or tables AND is not in a <td> that we are keeping
		var divs = $(elements).filter(allTypesExceptTable);
		for(var i=0; i < divs.size(); i++)
		{
			var elem = divs[i];
		
			//if this div, span has children, skip
			if(this._hasChildElements(elem,allTypes)) continue;
				
			//And if we have already kept a table that contains this div
			//skip
			if(this._keptParentTable(elem,keep)) continue;
			
			//otherwise keep
			if($(elem).text().trim().length == 0) continue;
		
			keep[keep.length] = elem;

		}
			
		var url = null;
		if($('#saved_suggest_URL').is(":visible")){
			url = $('#saved_suggest_URL').attr('href');
		}
		if(url != null){
			var suggested = [];
		
			var other = this._getPage(url);
			
			var j = 0;
			for(var i=0; i < keep.length; i++){
				var elem = keep[i];
				//alert($(elem).text());
				if(other.indexOf($(elem).text()) == -1){
					suggested[j] = elem;
					j++;
				}
			}
			
			
			keep = suggested;
		}
		return keep;
		/*
			
		var objects = document.evaluate("//body//*", document, null, XPathResult.ANY_TYPE, null);
		var thisObj = objects.iterateNext();
			
		var alertText = 'Items matching XPath Query in this document are:\n';
		var suggested = new Array();
	
		var index = 0;
		while (thisObj) {
			var processedText = getObjectText(thisObj);
			
			var oddCount = getOddCharCount(processedText);
			var longestWord = longestWordLength(processedText);

			if(processedText.length > 0){
				if(other.indexOf(processedText) == -1 && oddCount < 4 && longestWord < 20){
					suggested[index] = thisObj; 
					index++;
  					alertText += processedText + '\n';
  				}
			}
				
  			thisObj = objects.iterateNext();
		}
			
		return suggested;
		*/
			
	},
		
	_hasChildElements: function(root, childType){
		return $(root).find(childType).size() > 0;
	},
	
	//Two hueristics - if it contains a table
	//if it contains a div in a div
	_isStructuralTable: function(table){
		if( $(table).find("table").size() > 0) return true;
		if( $(table).find("div > div").size() > 0) return true;
		
		return false;
	},
	
	//Checks if the element has a parent which is a table in kept
	_keptParentTable: function(element,kept){
		var parentTables = $(element).parents("table");
		var keptParentTables = $(kept).filter(parentTables).size();			
		return keptParentTables > 0;
	},
	
	//Is the selection an element marked for scraping?
	_isSelectedGood:function(element){
		return $(element).hasClass(this.CLASS_GOOD);
	},
	
	//Is the selection an element we suggested user scrape?
	_isSelectedSuggestion: function(element){
		return $(element).hasClass(this.CLASS_SUGGESTION);
	},
	
	_addSelectionToUI: function(title, element){
		/*if(element.length>20)
			summaryString = string.substring(0, 20)+"...";
		else summaryString = element;*/
		$("#scrappySelectedElems").append("<li class='scrappy_sidebar'><span class='scrappy_sidebar scrappy_selected'>"+title+"</span></li>");
		
		//+": "+ summaryString+"</div><br/>");
	},
	//Prompts the user to add an id to the element, adds id
	_addScrappyId: function(element){		
		var id = this._getIdFromUser();
		//for right now just use a number name
		if (id != null){
			this._addSelectionToUI(id, element)
			$(element).attr(this.ID_NAME,this.counter);
			$(element).attr('title', "Field Name: " + id);
		}
		return id;
	},
	
	//Removes the id from element and 
	_removeScrappyId: function(element){
		$(element).removeAttr(this.ID_NAME);
		$(element).attr('title', "Element Not Selected");
	},
	
	_getIdFromUser: function(){
		var name = prompt("Name this Data Field");
		return name;
	},
	
	//Checks whether the element has been suggested or cliced on by the user (active)
	_isActiveElement: function(element){
		return $(element).hasClass(this.CLASS_GOOD) || $(element).hasClass(this.CLASS_SUGGESTION);
	},
	
	_getElementText: function(element){
		return $(element).text();
	},
	
	saveContentTemplate: function(){
		var objects = Array();
		var i = 0;
		var that=this;
		$("[" + this.ID_NAME + "]").each( function() {
			var object = {};
			var name = $(this).attr('title').split(":")[1].trim();
			object['name'] = name;
			var path = that._getElementXPath($(this)[0]);
			object['path'] = path;
			if($(this)[0].tagName == "TABLE"){
				object['type'] = that.TABLE_TYPE;
				object['cols'] = $(this).attr('cols');
			} else {
				object['type'] = that.DEFAULT_TYPE;
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
	},
	
	/* syncronously loads another page to serve as a template */
	_getPage: function(url){
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
	},
	
	/* Taken from firebug */
	_getElementXPath: function(element)
	{
		if (element && element.id) {
			return '//*[@id="' + element.id + '"]';
		} else {
			return this._getElementTreeXPath(element);
		}
	},

	/* Taken from firebug */
	_getElementTreeXPath: function (element)
	{
		var paths = [];

		// Use nodeName (instead of localName) so namespace prefix is included (if any).
		for (; element && element.nodeType == 1; element = element.parentNode)
		{
			var index = 0;
			for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
			{
			// Ignore document type declaration.
				if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
					continue;

				if (sibling.nodeName == element.nodeName)
					++index;
			}

			var tagName = element.nodeName.toLowerCase();
			var pathIndex = (index ? "[" + (index+1) + "]" : "");
			paths.splice(0, 0, tagName + pathIndex);
		}

		return paths.length ? "/" + paths.join("/") : null;
		
	},



/*
 ----------------------------------------------------------
Functions to start content template mode
----------------------------------------------------------
 */


	startContentTemplateMode: function(){
		$("#scrappySelectedElemsDiv").show();
		$("#scrappySB").height("auto");
		$("a").attr("onclick", "return false");
		$("#scrappy_title").html("Scrappy - Template Creation");
		var suggestionTypesExceptTable = "div, span, p, a, h1, h2, dd";
		var suggestionTypes = suggestionTypesExceptTable + ", table";
		var extraTypes = ", h3, h4, h5, h6, dt";
		var allTypes = suggestionTypes + extraTypes;
		var allTypesExceptTable = suggestionTypesExceptTable + extraTypes;
		var that = this;
		var suggestedElements = this.getSuggestions(suggestionTypes, suggestionTypesExceptTable);
		//Hack for sidebar
		suggestedElements = $(suggestedElements).not('.scrappy_sidebar');
		
		//----------------Prechosen Elements--------------
		$(suggestedElements).addClass(this.CLASS_SUGGESTION + ' ' + this.CLASS_TRANSPARENT);
		
		$(suggestedElements).attr('title',"Element Not Selected");
		
		//----------------All Elements Hover--------------
		//Can't use hover! Use -> over/ out!
		$(allTypes).not('.scrappy_sidebar').mouseover(
			function(event) {
				if(that._isActiveElement(this)) $(this).addClass(that.CLASS_OPAQUE);
				else $(this).addClass(that.CLASS_INACTIVE_HOVER);
				
				//Stop event from bubbling up
				event.stopPropagation();					
			});
		$(allTypes).not('.scrappy_sidebar').mouseout(
			function(event) {
				if(that._isActiveElement(this)) $(this).removeClass(that.CLASS_OPAQUE);
				else $(this).removeClass(that.CLASS_INACTIVE_HOVER);
				
				//Stop event from bubbling up
				event.stopPropagation();					
			}
		);
		
		//TODO: outer div-> clear inner
		
		//On a click to a div, table, span switch the highlight color
		$(allTypes).not('.scrappy_sidebar').click(function(event) {
	//for if we ever want to use the annotator
	//sendMessage(document.location.toString(),'show');
				//Case 1 - Currently: Selected as good, Now: disselect
				if(that._isSelectedGood(this))
				{
					
					$(this).removeClass(that.CLASS_GOOD);
					that._removeScrappyId(this);
					//Stop the event from registering a click on the outer div
					event.stopPropagation();
				
					console.log('click case 1');
					console.log(this);
				}
			
				//Case 2 - Currently: Selected as maybe, Now: select as good
				else if(that._isSelectedSuggestion(this))
				{
			
					if($(this)[0].tagName == "TABLE") {
						var selected = that._selectTable(this);
						if(selected != null){
							$(this).removeClass(that.CLASS_SUGGESTION);
							$(this).addClass(that.CLASS_GOOD);
						}

					} else {
						var name = that._addScrappyId(this);
						//Highlight as good if named
						if(name != null){
							$(this).removeClass(that.CLASS_SUGGESTION);
							$(this).addClass(that.CLASS_GOOD);
						}
					}
					
					//Don't bubble click up to enclosing divs
					event.stopPropagation();
				
					console.log('click case 2');
					console.log(this);
				}
			
				//Case 3 - Not currently selected
				//Similar to case 2, but now remove different div
				else 
				{
					if($(this)[0].tagName == "TABLE") {
						var selected = that._selectTable(this);
						if(selected != null){
							$(this).addClass(that.CLASS_GOOD);
						}

					} else {
						var name = that._addScrappyId(this);
				
						if(name != null){
							//Highlight as good
							$(this).addClass(that.CLASS_GOOD);
						}
					}
				
					//Don't bubble click up to outer divs
					event.stopPropagation();
				
					//Click fires mouseover event
					$(this).removeClass(that.CLASS_INACTIVE_HOVER);							
				
					console.log('click case 3');
					console.log(this);
					
				}
			
			
		});
	},
	_selectTable: function(table){
		var columnCount = this._getColumnCount(table);
		
		var colNames = Array();
		
		var tableName = this._getTableNameFromUser();
		if(tableName != null){
			$(table).attr(this.ID_NAME,this.counter);
			if(tableName.length > 0){
				$(table).attr('title',"Field Name: " + tableName);
			} else {
				$(table).attr('title',"Field Name: Table " + this.tableCounter);
				this.tableCounter++;
			}
		} else {
			return null;
		}
		
		for (var i = 0; i < columnCount; i++){
			this._highlightTableColumn(table, i);
			var colName = this._getColNameFromUser(i+1);
			this._removeColumnHighlight(table, i);
			if(colName != null){
				if(colName.length > 0){
					colNames[i] = colName;
				} else {
					colNames[i] = "Column " + (i+1);
				}
			} else {
				return null;
			}
		}
		
		if(tableName != null){
			$(table).attr('cols', JSON.stringify(colNames));
		}
		addSelectionToUI(tableName);
		return tableName;
		
	},
	
	_highlightTableColumn: function(table, col){
		var tr = $(table).find("tr");
		for(var i = 0; i < tr.length; i++){
			var td = $(tr[i]).find("td");
			if(td[col] != null){
				$(td[col]).addClass(this.CLASS_GOOD);
			}
		}
	},
	
	_removeColumnHighlight: function(table, col){
		var tr = $(table).find("tr");
		for(var i = 0; i < tr.length; i++){
			var td = $(tr[i]).find("td");
			if(td[col] != null){
				$(td[col]).removeClass(this.CLASS_GOOD);
			}
		}
	},
	
	_getColNameFromUser: function(colNum){
		var colName = prompt("Name column " + colNum + ":");
		return colName;
	},
	
	_getTableNameFromUser: function(){
		var name = prompt("Name the table:");
		return name;
	},
	
	_getColumnCount: function(table){
		var max = 0;
		var tr = $(table).find("tr");
		for(var i = 0; i < tr.length; i++){
			var td = $(tr[i]).find("td").length;
			if(td > max) {
				max = td;
			}
		}
		
		return max;
	},
	
/*	function display_state(){
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
				disableSuggest();
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
	*/
	disableSuggest: function(){
		$("*").not('.scrappy_sidebar').unbind();
		$("a").attr("onclick", "return true");
		$("."+this.CLASS_GOOD).removeClass(this.CLASS_GOOD);
		$("."+this.CLASS_SUGGESTION).removeClass(this.CLASS_SUGGESTION);
		$("."+this.CLASS_TRANSPARENT).removeClass(this.CLASS_TRANSPARENT);
		$("."+this.CLASS_OPAQUE).removeClass(this.CLASS_OPAQUE);
		$("."+this.CLASS_INACTIVE_HOVER).removeClass(this.CLASS_INACTIVE_HOVER);
	},
		
		/*
 ----------------------------------------------------------
 Link Selector Code
 ----------------------------------------------------------
 */
 
	getSimilarLinks: function(link){
		var xpath = this._getElementXPath($(link)[0]);
		xpath = xpath.replace(/\[([0-9]+)\]/g,"");
		var objects = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
		var thisObj = objects.iterateNext();
		var selected = new Array();
		var i = 0;
		while (thisObj) {
			selected[i] = thisObj;
			i++;
			thisObj = objects.iterateNext();
		}
		
		return selected;
	},
 
	highlightSimilarLinks: function(link){
		var selected = getSimilarLinks(link);
		
		for(var i = 0; i < selected.length; i++){
			var obj = selected[i];
			$(obj).removeClass(this.CLASS_SUGGESTION);
			$(obj).addClass(this.CLASS_GOOD);
		}
	},
		
	saveLinkData: function(){
		var links = new Array();
		var i = 0;
		$("." + this.CLASS_GOOD).each( function() {
			var link = {};
			var url = $(this).attr("href");
			if(url.indexOf("http") != 0){
				var hn = window.location.hostname;
				url = "http://" + hn + url;
			}
			link['url'] = url;
			link['name'] = $(this).text();
			links[i] = link;
			i++;
		});
					
		if(links.length == 0)
		{
			alert('Please choose some links to scrape');
			return false;
		}
		
		datamgr.save(links,datamgr.LINK);
		return true;

	},
		
	startLinkSelectionMode: function(){
		var allTypes = "a";
		
		//var suggestedElements = getLinkSuggestions();
		
		//Hack for sidebar
		//suggestedElements = $(suggestedElements).not('.scrappy_sidebar');
		
		//----------------Prechosen Elements--------------
		//$(suggestedElements).addClass(this.CLASS_SUGGESTION + ' ' + CLASS_TRANSPARENT);
		
		//$(suggestedElements).attr('title',"Element Not Selected");
		
		//----------------All Elements Hover--------------
		//Can't use hover! Use -> over/ out!
		$(allTypes).not('.scrappy_sidebar').mouseover(
			function(event) {
				var sim = getSimilarLinks(this);
				if(this._isActiveElement(this)) {
					$(this).addClass(this.CLASS_OPAQUE);
					for(var i = 0; i < sim.length; i++){
						var obj = sim[i];
						if(!$(obj).hasClass(this.CLASS_GOOD)){
							$(obj).addClass(this.CLASS_OPAQUE);
						}
					}
				} else {
					$(this).addClass(this.CLASS_INACTIVE_HOVER);
					for(var i = 0; i < sim.length; i++){
						var obj = sim[i];
						if(!$(obj).hasClass(this.CLASS_GOOD)){
							$(obj).addClass(this.CLASS_INACTIVE_HOVER);
						}
					}
				}
				
				//Stop event from bubbling up
				event.stopPropagation();					
			});
		$(allTypes).not('.scrappy_sidebar').mouseout(
			function(event) {
				var sim = getSimilarLinks(this);
				if(this._isActiveElement(this)) {
					$(this).removeClass(this.CLASS_OPAQUE);
					for(var i = 0; i < sim.length; i++){
						var obj = sim[i];
						$(obj).removeClass(this.CLASS_OPAQUE);
					}
				} else {
					$(this).removeClass(this.CLASS_INACTIVE_HOVER);
					for(var i = 0; i < sim.length; i++){
						var obj = sim[i];
						$(obj).removeClass(this.CLASS_INACTIVE_HOVER);
					}
				}
				
				//Stop event from bubbling up
				event.stopPropagation();					
			}
		);
		
		//TODO: outer div-> clear inner
		
		//On a click to a div, table, span switch the highlight color
		$(allTypes).not('.scrappy_sidebar').click(function(event) {
			
			//Case 1 - Currently: Selected as good, Now: disselect
			if(this._isSelectedGood(this))
			{
				$(this).removeClass(this.CLASS_GOOD);
				//removeScrappyId(this);
				//Stop the event from registering a click on the outer div
				event.stopPropagation();
				console.log('click case 1');
				console.log(this);
			}
			
			//Case 2 - Currently: Selected as maybe, Now: select as good
			else if(this._isSelectedSuggestion(this))
			{
			
				//Highlight as good
				$(this).removeClass(this.CLASS_SUGGESTION);
				$(this).addClass(this.CLASS_GOOD);
				highlightSimilarLinks(this);

				//Name
				//this._addScrappyId(this);
				
				//Don't bubble click up to enclosing divs
				event.stopPropagation();
				
				console.log('click case 2');
				console.log(this);
			}
			
			//Case 3 - Not currently selected
			//Similar to case 2, but now remove different div
			else 
			{
				//Highlight as good
				$(this).addClass(this.CLASS_GOOD);
				var sim = getSimilarLinks(this);
				for(var i = 0; i < sim.length; i++){
					var obj = sim[i];
					$(obj).removeClass(this.CLASS_INACTIVE_HOVER);
					$(obj).removeClass(this.CLASS_OPAQUE);
				}

				//this._addScrappyId(this);
				
				highlightSimilarLinks(this);
				//Don't bubble click up to outer divs
				event.stopPropagation();
				
				//Click fires mouseover event
				$(this).removeClass(this.CLASS_INACTIVE_HOVER);							
				
				console.log('click case 3');
				console.log(this);
			}
		});
	},
		
/*
 ----------------------------------------------------------
 Text Processing Functions for Suggestions
 ----------------------------------------------------------
 */
		
	_htmlEntityDecode: function(str) {
		var ta = content.document.createElement("textarea");
		ta.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		return ta.value;
	},
	
	getOddCharCount: function(str) {
		var count = str.split(/&|"|;|=/g).length - 1;
		return count;
	},
	
	longestWordLength: function(str) {
		var max = 0;
		var processed = str.split(/\s+/g);
		for(var index in processed){
			snippet = processed[index];
			if(snippet.length > max){
				max = snippet.length;
			}
		}
		return max;
	},
	
	getObjectText: function (obj){
		var text = obj.innerHTML;
	
		var elemIndex = text.indexOf("<");
		if(elemIndex != -1){
			text = text.substring(0, elemIndex);
		}
		
		var processedText = this._htmlEntityDecode(text).replace(/^\s+|\s+$/g,"");
		
		return processedText;
	}
}