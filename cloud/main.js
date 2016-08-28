Parse.serverURL = 'http://pensumapi.herokuapp.com/parse';

Parse.Cloud.define('hello', function(req, res) {
  	res.success('Hi');
});

Parse.Cloud.afterDelete("Task", function(request) {
  	query = new Parse.Query("Conversation");
  	query.equalTo("task", request.object);
  	query.find({
    	success: function(conversations) {
        	Parse.Cloud.useMasterKey();
      		Parse.Object.destroyAll(conversations, {
        		success: function() {},
        		error: function(error) {
          			console.error("Error deleting Task related conversations " + error.code + ": " + error.message);
        		}
      		});
    	},
    	error: function(error) {
      		console.error("Error finding Task related conversations " + error.code + ": " + error.message);
    	}
  	});
});