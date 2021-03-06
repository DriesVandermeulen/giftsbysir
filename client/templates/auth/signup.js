var ERRORS_KEY = 'signupErrors';

Template.signup.onCreated(function() {
    Session.set(ERRORS_KEY, {});
});

Template.signup.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY));
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    }
});

Template.signup.events({
    'click #signup': function(event, template) {
        event.preventDefault();
        var email = template.$('[name=email]').val();
        var password = template.$('[name=password]').val();
        var confirm = template.$('[name=confirm]').val();

        var errors = {};

        if (! email) {
            errors.email = 'Email required';
        }

        if (! password) {
            errors.password = 'Password required';
        }

        if (confirm !== password) {
            errors.confirm = 'Please confirm your password';
        }

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return;
        }

        Accounts.createUser({
            email: email,
            password: password
        }, function(error) {
            if (error) {
                return Session.set(ERRORS_KEY, {'none': error.reason});
            }

            FlowRouter.go('/');
        });
    }
});
