Meteor.startup(function () {
    Meteor.users.remove({});

    if (Meteor.users.find().count() === 0) {
        var users = [
            {name:"Dries",email:"dries@giftsbysir.com",roles:['admin']},
            {name:"Stein",email:"stein@giftsbysir.com",roles:['admin']},
            {name:"Manu",email:"manu@giftsbysir.com",roles:['admin']},
            {name:"Vincent",email:"vincent@giftsbysir.com",roles:['admin']}
        ];

        _.each(users, function (user) {
            var id;

            id = Accounts.createUser({
                email: user.email,
                password: "giftsbysir",
                profile: { name: user.name }
            });

            if (user.roles.length > 0) {
                // Need _id of existing user record so this call must come
                // after `Accounts.createUser` or `Accounts.onCreate`
                Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
            }

        });
    }
});