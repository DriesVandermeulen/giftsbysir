Gifts = new Mongo.Collection("gifts");
Tags = new Mongo.Collection("tags");
Events = new Mongo.Collection("events");

Template.home.onCreated(function() {

	this.results = new ReactiveVar([]);
	this.search = {};
	this.shownTag = new ReactiveVar("Nothing Yet");
	this.primaryTags = Tags.find({type: "CONTEXT_PRIMARY"}).fetch();
	this.selectedArray = [];
	this.notSelectedArray = [];

	this.findByTag = function(search) {
		var query = {$and: []};
		if(search.age) {
			query.$and.push({"age.min":{ $lte: search.age}});
			query.$and.push({"age.max":{ $gte: search.age}});
		}
		if(search.price){
			var price = {$and: []};
			if (search.price.min){
				price.$and.push({"price" : {$gte: search.price.min}})
			}
			if (search.price.max){
				price.$and.push({"price" : {$lte: search.price.max}})
			}
			query.$and.push(price);
		}
		if(search.gender){
			query.$and.push({$or: [
										{"gender" : search.gender},
										{"gender" : "N"}
									]});
		}
		if(search.event){
			query.$and.push({"events.name": search.event});
		}
		if(search.primary){
			query.$and.push({"tags.context.primary.name":{ $in: search.primary}});
		}
		if(search.secondary){
			query.$and.push({"tags.context.secondary.name":{ $in: search.secondary}});
		}
		if(search.gifts) {
			query.$and.push({"id":{ $in: search.gifts}});
		}
		return Gifts.find(query);
	}

	this.getTag = function() {
		var randomID = Math.floor(Math.random()*this.primaryTags.length);
		var randomItem = this.primaryTags[randomID];
		this.shownTag.set(randomItem.name);
	}

	this.getTag();

	//print out collection with added gifts
	console.log("Gifts after creation : " + Gifts.find().fetch());
	console.log(Gifts.find().fetch());
});

Template.home.helpers({
    isAdmin: function() {
        return Meteor.isAdmin()
    },

    results: function()  {
    	return Template.instance().results.get();
    },

    shownTag: function() {
    	return Template.instance().shownTag.get();
    }

});



Template.home.events({
    "click .logout" : function() {
        Meteor.logout();
        FlowRouter.go('/login')
    },

    'click #searchGift' : function(event, template) {

    	//var search = {};

    	var age = template.$('[name=age]').val();
    	var priceMin = template.$('[name=minPrice]').val();
		var priceMax = template.$('[name=maxPrice]').val();
		var gender = template.$('[name=gender]').val();
		var event = template.$('[name=event]').val();
		var primaryTagString = template.$('[name=primaryTag]').val();
		var secondaryTagString = template.$('[name=secondaryTag]').val();

		if(age) {
			template.search.age = parseInt(age);
		}
		if(priceMin || priceMax) {
			template.search.price = {
				min: parseInt(priceMin),
				max: parseInt(priceMax) 
			}	
		}
		if(gender) {
			template.search.gender = gender;	
		}
		if(event) {
			template.search.event = event;	
		}
		if(primaryTagString) {
			template.search.primary = primaryTagString.split(',');
		}
		if(secondaryTagString) {
			template.search.secondary = secondaryTagString.split(',');	
		}

    	template.results.set(template.findByTag(template.search));	
    },

    'click #saveResults' : function(event, template) {
    	template.search.gifts = _.pluck(template.results.get().fetch(), '_id');

    },

    'click #addGift' : function(event, template) {

    	var gift = {};
    	var name = template.$('[name=name]').val();
    	var description = template.$('[name=description]').val();
    	var minAge = template.$('[name=minAge]').val();
    	var maxAge = template.$('[name=maxAge]').val();
		var price = template.$('[name=price]').val();
		var gender = template.$('[name=genderInsert]').val();
		var event = template.$('[name=eventInsert]').val();
		var giftTagString = template.$('[name=giftTagInsert]').val();
		var primaryTagString = template.$('[name=primaryTagInsert]').val();
		var secondaryTagString = template.$('[name=secondaryTagInsert]').val();

		if(name) {
			gift.name = name;
		}
		if(description) {
			gift.description = description;
		}
		if(minAge || maxAge) {
			gift.age = {
				min: parseInt(minAge),
				max: parseInt(maxAge) 
			}	
		}
		if(price) {
			gift.price = parseInt(price);
		}
		
		if(gender) {
			gift.gender = gender;	
		}
		if(event) {
			gift.events = [];
			var eventTags = event.split(',');

			_.each(eventTags, function(tagName){
				var tag = Events.findOne({name: tagName});

				if (!tag){
					tag = {
						name: tagName.trim(),
					};
					var id = Events.insert(tag);
					tag = Events.findOne(id);
				};
				
				gift.events.push(tag);

			})
			gift.event = [event];	
		}
		if(giftTagString) {
			gift.tags = {};
			gift.tags.gifts = [];

			var giftTags = giftTagString.split(',');

			_.each(giftTags, function(tagName){
				var tag = Tags.findOne({name: tagName, type: "GIFTS"});

				if (!tag){
					tag = {
						name: tagName.trim(),
						type: "GIFTS"
					};
					var id = Tags.insert(tag);
					tag = Tags.findOne(id);
				};
				
				gift.tags.gifts.push(tag);

			});
		}
		if(primaryTagString) {
			gift.tags.context = {};
			gift.tags.context.primary = [];

			var primaryTags = primaryTagString.split(',');

			_.each(primaryTags, function(tagName){
				var tag = Tags.findOne({name: tagName, type: "CONTEXT_PRIMARY"});

				if (!tag){
					tag = {
						name: tagName.trim(),
						type: "CONTEXT_PRIMARY"
					};
					var id = Tags.insert(tag);
					tag = Tags.findOne(id);
				};

				gift.tags.context.primary.push(tag);

			});

		}
		if(secondaryTagString) {
			//gift.tags.context = {};
			gift.tags.context.secondary = [];

			var secondaryTags = secondaryTagString.split(',');

			_.each(secondaryTags, function(tagName){
				var tag = Tags.findOne({name: tagName, type: "CONTEXT_SECONDARY"});

				if (!tag){
					tag = {
						name: tagName.trim(),
						type: "CONTEXT_SECONDARY"
					};
					var id = Tags.insert(tag);
					tag = Tags.findOne(id);
				};

				gift.tags.context.secondary.push(tag);

			});
			
		}
		var giftID = Gifts.insert(gift);

    },

    'click #addSelectedArray' : function(event, template) {

    	template.selectedArray.push(template.shownTag.get()); 

    	template.primaryTags = _.reject(template.primaryTags, function(el) { return el.name === template.shownTag.get(); });

    	var randomID = Math.floor(Math.random()*template.primaryTags.length);
    	var randomItem = template.primaryTags[randomID];
    	if(randomItem){
    		template.shownTag.set(randomItem.name);
    		return;
    	}
    	template.shownTag.set("No more questions to ask")


    },

    'click #addNotSelectedArray' : function(event, template) {

    	template.notSelectedArray.push(template.shownTag.get()); 

    	template.primaryTags = _.reject(template.primaryTags, function(el) { return el.name === template.shownTag.get(); });

    	var randomID = Math.floor(Math.random()*template.primaryTags.length);
    	var randomItem = template.primaryTags[randomID];
    	if(randomItem){
    		template.shownTag.set(randomItem.name);
    		return;
    	}
    	template.shownTag.set("No more questions to ask")

    }

});
