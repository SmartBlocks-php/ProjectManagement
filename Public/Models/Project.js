define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ProjectManagement/Projects",
        getDeadlines: function () {
            var base = this;
            var deadlines = SmartBlocks.Blocks.ProjectManagement.Data.deadlines.filter(function (deadline){
                return deadline.get("project").id == base.get("id");
            });
            return deadlines;
        }
    });
    return Model;
});