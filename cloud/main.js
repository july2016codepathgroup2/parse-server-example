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

Parse.Cloud.define('pushChannelTest', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  // extract out the channel to send
  var action = params.action;
  var message = params.message;
  var customData = params.customData;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

  var payload = {"data": {
      "alert": message,
      "action": action,
      "customdata": customData}
                };

  // Note that useMasterKey is necessary for Push notifications to succeed.

  Parse.Push.send({
  where: pushQuery,      // for sending to a specific channel                                                                                                                                 data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});

Parse.Cloud.define('pushBidReceived', function(request, response) {

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  // extract out the channel to send
  var action = params.action;
  var message = params.message;
  var postOwner = params.postOwner;
//   var bidder = params.candidate;
//   var bidPrice = params.bidPrice;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.whereEqualTo("userObjectId", postOwner);
  pushQuery.equalTo("deviceType", "android");

  var payload = {"data": {
      "alert": message,
      "action": action
                };

  // Note that useMasterKey is necessary for Push notifications to succeed.

  Parse.Push.send({
  where: pushQuery,      // for sending to a specific channel                                                                                                                                 data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});
