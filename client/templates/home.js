Gifts = new Mongo.Collection("gifts");

Template.home.onCreated(function() {

	this.firstSelectionArray = new ReactiveVar([]);
	this.secondSelectionArray = new ReactiveVar([]);

	this.findByTag = function(search) {
		var query = {$and: []};
		if(search.age) {
			query.$and.push({"age.min":{ $lte: search.age}});
			query.$and.push({"age.max":{ $gte: search.age}});
		}
		if(search.price){
			query.$and.push({"price":{
									$and: [
										{$gte: search.minPrice},
										{$lte: search.maxPrice}
									]}});
		}
		if(search.gender){
			query.$and.push({"gender":{ 
									$or: [
										search.gender,
										"N"
									]}});
		}
		if(search.event){
			query.$and.push({"event": search.event});
		}
		if(search.primary){
			query.$and.push({"tags.context.primary.name":{ $in: search.primary}});
		}
		if(search.secondary){
			query.$and.push({"tags.context.secondary.name":{ $in: search.secondary}});
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

    secondSelectionArray: function()  {
    	return Template.instance().secondSelectionArray.get();
    },

    firstSelectionArray: function()  {
    	return Template.instance().firstSelectionArray.get();
    }

});



Template.home.events({
    "click .logout" : function() {
        Meteor.logout();
        FlowRouter.go('/login')
    },

    'click #searchGift' : function(event, template) {

    	var search = {};

    	var age = template.$('[name=age]').val();
    	var priceMin = template.$('[name=minPrice]').val();
		var priceMax = template.$('[name=maxPrice]').val();
		var gender = template.$('[name=gender]').val();
		var event = template.$('[name=event]').val();
		var primaryTagString = template.$('[name=primaryTag]').val();
		var secondaryTagString = template.$('[name=secondaryTag]').val();

		if(age) {
			search.age = parseInt(age);
		}
		if(priceMin || priceMax) {
			search.price = {
				min: parseInt(priceMin),
				max: parseInt(priceMax) 
			}	
		}
		if(gender) {
			search.gender = gender;	
		}
		if(event) {
			search.event = event;	
		}
		if(primaryTagString) {
			search.primary = primaryTagString.split(',');
		}
		if(secondaryTagString) {
			search.secondary = secondaryTagString.split(',');	
		}

    	template.secondSelectionArray.set(template.findByTag(search));

    }

});
