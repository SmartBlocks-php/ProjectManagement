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
                return deadline.get("project") && deadline.get("project").id == base.get("id");
            });
            return deadlines;
        },
        getTasks: function () {
            var base = this;
            var tasks = [];
            var deadlines = base.getDeadlines();
            for (var k in deadlines) {
                var d_tasks = deadlines[k].getTasks();
                for (var i in d_tasks) {
                    tasks.push(d_tasks[i]);
                }
            }
            return tasks;
        },
        save: function(attributes, options) {
            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.save.call(this, attributes, options);
        },
        destroy: function(attributes, options) {

            var base = this;
            var deadlines = base.getDeadlines();
            for (var j in deadlines) {
                deadlines[j].destroy();
            }

            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.destroy.call(this, attributes, options);
        }
    });
    return Model;
});