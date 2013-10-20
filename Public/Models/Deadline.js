define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ProjectManagement/Deadline",
        getDate: function () {
            var base = this;
            return new Date(base.get("date"));
        },
        setDate: function (date) {
            var base = this;
            base.set("date", date.toISOString());
        }
    });
    return Model;
});