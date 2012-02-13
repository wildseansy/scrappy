var datamgr= {
	CONTENT:'content',
	LINK:'link',
	ADDON_DISABLED:"disabledAddon",
	STATE: 'state',
	
	/* wrap up a message and send it to main.js */
	save: function(data, type)
	{
		
		//Message object
		var message = {};
		message['data'] = data;
		message['type'] = type;
		message = [message];  	//hack for eval
		
		//Convert to a string, automatically escapes special chars
		var jsonString = JSON.stringify(message);
		
		self.postMessage(jsonString);  //post message to main.js
	}

}