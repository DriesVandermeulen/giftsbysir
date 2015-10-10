
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

    var Gifts = new Mongo.Collection("gifts");

     if (Gifts.find().count() === 0) {
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

    }
        

});