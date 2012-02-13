//Handle input and output
self.port.on("receiveArguments", function(arguments) {
  var dataElements = eval(arguments); 
  var minedData = getData(dataElements);
  self.port.emit("return", JSON.stringify(minedData));
});


//Mine data
function getData(elements){
	prepareDOMForParsing();
	console.log("Beginning Mining");
	for(var i = 0; i < elements.length; i++){
		var element = elements[i];
		element.data = getElementData(element);
		if(!dataValid(element.data, element.type)){
			element.path = generalizeElementPath(element.path);
			element.data = getElementData(element);
		}
		console.log("Mined:" + element.data);
		
		//remove the path url from the output
		delete element.path;
		if(element.type == 'table') delete element.cols;
		delete element.type;
	}
	console.log("Ending Mining");
	return elements;
}


function dataValid(data, type){
	if(type == 'table'){
		if(data.length > 1){
			if(data[1].length > 0){
				return true;
			}
		}
	} else {
		return data.length > 0;
	}
	return false;
}


function generalizeElementPath(path){
	var updatedPath = "";
	var splitPath = path.split("/");
	for(var i = 1; i < splitPath.length; i++){
		var part = "";
		if(i < splitPath.length - 1){
			part = splitPath[i].replace(/\[([0-9]+)\]/g,"");
		} else {
			part = splitPath[i];
		}
		updatedPath += "/" + part;
	}
	return updatedPath;
}


function getElementData(element){
	var queryEval = document.evaluate(element.path, document, null, XPathResult.ANY_TYPE, null);
	var obj = queryEval.iterateNext();
	if(element.type == 'table'){
		var colNames = eval(element.cols);
		var table = new Array();
		table[0] = colNames;
		var tr = $(obj).find("tr");
		for(var i = 0; i < tr.length; i++){
			var row = new Array();
			var td = $(tr[i]).find("td");
			for(var col = 0; col < colNames.length; col++){
				if(td[col] != null){			
					row[col] = $(td[col]).text().trim().replace(/\s/g, ' ');
				} else {
					row[col] = null;
				}
			}
			table[i+1] = row;
		}
		return table;
	} else {
		return $(obj).text().trim().replace(/\s/g, ' ');
	}


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
	
