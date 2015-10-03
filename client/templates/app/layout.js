Template.layout.helpers({

});

Template.layoutAdmin.helpers({
    isAdmin: function() {
        return Meteor.isAdmin()
    }
});

Template.layout.events({

});

