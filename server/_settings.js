if (typeof Meteor.settings === 'undefined')
    Meteor.settings = {};

_.defaults(Meteor.settings, {
    facebook: {
        appId: "903324026387552",
        secret: "4775015f2db1dc9308c5235e0d599eb8"
    }
});

ServiceConfiguration.configurations.upsert(
    { service: "facebook" },
    {
        $set: {
            appId: Meteor.settings.facebook.appId,
            secret: Meteor.settings.facebook.secret
        }
    }
);