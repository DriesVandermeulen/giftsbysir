Template.home.onCreated(function() {

});

Template.home.helpers({
    isAdmin: function() {
        return Meteor.isAdmin()
    }
});



Template.home.events({
    "click .logout" : function() {
        Meteor.logout();
        FlowRouter.go('/login')
    }
});
