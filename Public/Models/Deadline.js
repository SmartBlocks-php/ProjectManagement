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
        },
        getTasks: function () {
            var base = this;
            var tasks = SmartBlocks.Blocks.TaskManagement.Data.tasks.filter(function (task) {
                return task.get('deadline_id') && task.get('deadline_id') == base.get('id');
            });
            return tasks;
        },
        addTask: function (task) {
            var base = this;

            base.get("tasks").push(task.attributes);

        },
        removeTask:function (task) {
            var base = this;
            var index = -1;
            var tasks = base.get("tasks");
            for (var k in tasks) {
                if (tasks[k].id == task.get('id')) {
                    index = k;
                }
            }
            if (index != -1) {
                delete base.get("tasks")[index];
            }
            return index != -1;
        },
        getProject: function () {
            var base = this;
            console.log(base.attributes);
            var project = SmartBlocks.Blocks.ProjectManagement.Data.projects.get(base.get("project").id);
            return project;
        },
        save: function(attributes, options) {
            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.save.call(this, attributes, options);
        },
        destroy: function(attributes, options) {

            var base = this;
            var tasks = base.getTasks();
            for (var j in tasks) {
                tasks[j].destroy();
            }

            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.destroy.call(this, attributes, options);
        }
    });
    return Model;
});