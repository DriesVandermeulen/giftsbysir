FlowRouter.notFound = {
    action: function () {
        BlazeLayout.render("layout", {content: "notFound"})
    }
}

FlowRouter.route('/login', {
    action: function () {
        BlazeLayout.render('layout', {content: 'login'})
    }
})

FlowRouter.route('/signup', {
    action: function () {
        BlazeLayout.render('layout', {content: 'signup'})
    }
})

FlowRouter.route('/', {
    action: function () {
        if(Meteor.isAdmin()) {
            BlazeLayout.render('layoutAdmin', {content: 'home'})
        } else if(Meteor.user()) {
            BlazeLayout.render('layoutUser', {content: 'home'})
        } else {
            BlazeLayout.render('layout', {content: 'login'})
        }
    }
})

Meteor.isAdmin = function(){
    return Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)
};


