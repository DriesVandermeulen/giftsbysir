Gifts = new Mongo.Collection("gifts");
firstSelectionArray = [];
secondSelectionArray = [];


Template.home.onCreated(function() {

	//insert Gift1 with 1 Gifts tag + Contact tags : 1 primary Tag and 2 SubTags | Housewarming
	Gifts.insert({
		name: "Gift1",
		description: "test",
		events: [{
			name: "housewarming",
			eventId: 1
		}],
		price: 50,
		gender: 'M',
		age: {
			min: 18,
			max: 30
		},
		tags: {
			gift: [{
				name: "book",
				tagId: 1
			}],
			context: [{
				primary: {
					name: "reading",
					tagId: 1
				},
				secondary: [
				{
					name: "best seller",
					tagId: 1
				},
				{
					name: "bibliografie",
					tagId: 1
				}]	
			}]
		}
	});

	//insert Gift2 with 1 Gifts tag + Contact tags : 1 primary Tag and 2 SubTags | Housewarming
	Gifts.insert({
		name: "Gift2",
		description: "test",
		events: [{
			name: "housewarming",
			eventId: 1
		}],
		price: 50,
		gender: 'M',
		age: {
			min: 18,
			max: 30
		},
		tags: {
			gift: [{
				name: "onderleggers",
				tagId: 1
			}],
			context: [{
				primary: {
					name: "interior",
					tagId: 1
				},
				secondary: [
				{
					name: "design",
					tagId: 1
				},
				{
					name: "modern",
					tagId: 1
				}]	
			}]
		}
	});

	//insert Gift3 with 1 Gifts tag + Contact tags : 2 primary Tag and 1 SubTags | Housewarming
	Gifts.insert({
		name: "Gift3",
		description: "test",
		events: [{
			name: "housewarming",
			eventId: 1
		}],
		price: 50,
		gender: 'M',
		age: {
			min: 18,
			max: 30
		},
		tags: {
			gift: [{
				name: "calender",
				tagId: 1
			}],
			context: [{
				primary: [{
					name: "reading",
					tagId: 1
				},
				{
					name: "ecology",
					tagId: 1
				}],
				secondary: [{
					name: "calender",
					tagId: 1
				}]	
			}]
		}
	});

	//insert Gift4 with 1 Gifts tag + Contact tags : 2 primary Tag and 1 SubTags | Housewarming
	Gifts.insert({
		name: "Gift4",
		description: "test",
		events: [{
			name: "housewarming",
			eventId: 1
		}],
		price: 50,
		gender: 'M',
		age: {
			min: 18,
			max: 30
		},
		tags: {
			gift: [{
				name: "calender",
				tagId: 1
			}],
			context: [{
				primary: [{
					name: "reading",
					tagId: 1
				},
				{
					name: "ecology",
					tagId: 1
				}],
				secondary: [{
					name: "calender",
					tagId: 1
				}]	
			}]
		}
	});

	//print out collection with added gifts
	console.log("Gifts after creation : " + Gifts.find().fetch());
	console.log(Gifts.find().fetch());

	//Find all gifts with Primary Conect tags to hardcoded name || Collection Method
	//firstSelection = new Mongo.Collection("firstSelection");
	//Gifts.find({"tags.context.primary.name":"reading"}).forEach(function(doc){firstSelection.insert(doc);});
	//console.log(firstSelection.find().fetch());

	//Find all gifts with secondary Context tags to hardcoded name || Collection Method
	//secondSelection = new Mongo.Collection("secondSelection");
	//firstSelection.find({"tags.context.secondary.name":"best seller"}).forEach(function(doc){secondSelection.insert(doc);});
	//console.log(secondSelection.find().fetch());

	//Find all gifts with Primary Conect tags to hardcoded name || Array Method
	//Gifts.find({"tags.context.primary.name":"reading"}).forEach(function(doc){firstSelectionArray.push(doc);});

	//Test -- Gifts collection = FirstelecectionArray
	Gifts.find().forEach(function(doc){firstSelectionArray.push(doc);});
	console.log("firstSelectionArray after creation : ");
	console.log(firstSelectionArray);
    console.log("secondSelectionArray after creation : ");
	console.log(secondSelectionArray);

	//TEST
    //Find all gifts with secondary Context tags to hardcoded name || Array Method 
	console.log("Start creation secondSelectionArray : ");
	for (var i=0,  tot=firstSelectionArray.length; i < tot; i++) {
	  if (firstSelectionArray[i].tags.context[0].secondary[0].name === "calender"){
	  	secondSelectionArray.push(firstSelectionArray[i])
	  	console.log("match added in Array");
	  }
	  else{
	 	console.log("Iterating through array, no match for current element");
	  }
	}
	console.log("Search secondary tags complete");
	console.log(secondSelectionArray);
	
});

Template.home.helpers({
    isAdmin: function() {
        return Meteor.isAdmin()
    },

    //Display array of Secundary Tag Search 
    //iterating through array adding, different gifs in different rows
    //At the moment only Name and Descriptions is showed (can be extended)

    displayArray: function() {	
		var table = document.createElement("table");
		for (var i = 0; i < secondSelectionArray.length; i++) {
		  var row = table.insertRow(-1);
		  var nameCell = row.insertCell(-1);
		  nameCell.appendChild(document.createTextNode(secondSelectionArray[i].name));
		  var descriptionCell = row.insertCell(-1);
		  descriptionCell.appendChild(document.createTextNode(secondSelectionArray[i].description));
		}
		document.body.appendChild(table);
    }

});



Template.home.events({
    "click .logout" : function() {
        Meteor.logout();
        FlowRouter.go('/login')
    },
    'click #searchPrimary' : function(event, template) {

    	firstSelectionArray = [];
    	var primaryTag = template.$('[name=primaryTag]').val();
        
        Gifts.find({"tags.context.primary.name":primaryTag}).forEach(function(doc){firstSelectionArray.push(doc);});
        
        console.log("Primary tag search complete");
        console.log(firstSelectionArray);
        return firstSelectionArray;
        FlowRouter.go('/')
    },
    'click #searchSecondary' : function(event, template) {
	  	
	  	secondSelectionArray = [];
	  	var secondaryTag = template.$('[name=secondaryTag]').val();

	  	//TO DO - Add check if firstSelectionArray is empty

	  	for (var i=0,  tot=firstSelectionArray.length; i < tot; i++) {
		  if (firstSelectionArray[i].tags.context[0].secondary[0].name === secondaryTag){
		  	secondSelectionArray.push(firstSelectionArray[i])
		  	console.log("match added in Array");
		  }
		  else{
		 	console.log("Iterating through array, no match for current element");
		  }
		}
		console.log("Search secondary tags complete");
		console.log(secondSelectionArray);
		return secondSelectionArray;
		FlowRouter.go('/')
    }
});
