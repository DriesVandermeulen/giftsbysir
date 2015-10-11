Gifts = new Mongo.Collection("gifts");

Template.home.onCreated(function() {

	this.results = new ReactiveVar([]);
	this.search = {};
	this.insertGift = {};

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

    	var name = template.$('[name=name]').val();
    	var description = template.$('[name=description]').val();
    	var minAge = template.$('[name=minAge]').val();
    	var maxAge = template.$('[name=maxAge]').val();
		var price = template.$('[name=price]').val();
		var gender = template.$('[name=genderInsert]').val();
		var event = template.$('[name=eventInsert]').val();
		var giftTag = template.$('[name=giftTagInsert]').val();
		var primaryTagString = template.$('[name=primaryTagInsert]').val();
		var secondaryTagString = template.$('[name=secondaryTagInsert]').val();

		if(name) {
			template.insertGift.name = name;
		}
		if(description) {
			template.insertGift.description = description;
		}
		if(minAge || maxAge) {
			template.insertGift.age = {
				min: parseInt(minAge),
				max: parseInt(maxAge) 
			}	
		}
		if(price) {
			template.insertGift.price = parseInt(price);
		}
		
		if(gender) {
			template.insertGift.gender = gender;	
		}
		if(event) {
			template.insertGift.event = event;	
		}
		if(giftTag) {
			template.insertGift.tags.gift.name = giftTag.split(',');
		}
		if(primaryTagString) {
			template.insertGift.tags.context.primary.name = primaryTagString.split(',');
		}
		if(secondaryTagString) {
			template.insertGift.tags.context.secondary.name = secondaryTagString.split(',');	
		}

		Gifts.insert(template.insertGift);

    }

});
