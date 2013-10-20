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
        }
    });
    return Model;
});