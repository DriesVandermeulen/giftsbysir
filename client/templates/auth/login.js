var ERRORS_KEY = 'signinErrors';

Template.login.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

Template.login.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

Template.login.events({
    'click #login': function(event, template) {
        event.preventDefault();

        var email = template.$('[name=email]').val();
        var password = template.$('[name=password]').val();

        var errors = {};

        if (! email) {
            errors.email = 'Email is required';
        }

        if (! password) {
            errors.password = 'Password is required';
        }

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return;
        }

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                return Session.set(ERRORS_KEY, {'none': error.reason});
            } else {
                FlowRouter.go('/');
                FlowRouter.reload()
            }
        });
    },

    'click #login-facebook': function(event, template) {
        event.preventDefault();
        Meteor.loginWithFacebook({}, function (error) {
            if (error)
                Session.set(ERRORS_KEY, {'none': error.reason || 'Unknown error'} );
            else
                FlowRouter.go('/');
        });
    }
});
