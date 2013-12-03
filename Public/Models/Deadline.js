define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ProjectManagement/Deadline",
        constructor: function () {
            var base = this;
            Backbone.Model.apply(this, arguments);

            if (!base.get("tasks") || !base.get("tasks").models) {
                var tasks = new SmartBlocks.Blocks.TaskManagement.Collections.Tasks(base.get("tasks"));
                base.set("tasks", tasks);
            }

            SmartBlocks.events.on("ws_notification", function (message) {
                if (!message.notifier || message.notifier != SmartBlocks.current_user.get('id')) {
                    if (message.block == "TaskManagement") {
                        if (message.action == "deleted_task") {
                            var task_array = message.task;
                            var tasks = base.get("tasks").remove(message.task.id);
                            if (!tasks.get(message.task.id))
                                console.log("removed", base.get('id'));
                            else
                                console.log("could not remove task");
                        }
                    }
                }
            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("add", function (task) {
                if (task.get('deadline_id') == base.get('id')) {
                    base.get("tasks").add(task);
                }
            });
            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("remove", function (task) {
                if (task.get('deadline_id') == base.get('id')) {
                    base.get("tasks").remove(task);
                }
            });
        },
        parse: function (response) {

            var tasks_array = response.tasks;

            var tasks = new SmartBlocks.Blocks.TaskManagement.Collections.Tasks(tasks_array);
            response.tasks = tasks;


            return response;
        },
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

            var tasks = [];
            var tasks_array = base.get('tasks');

            for (var k in tasks_array.models) {
                var task = SmartBlocks.Blocks.TaskManagement.Data.tasks.get(tasks_array.models[k].get('id'));
                if (task) {
                    tasks.push(task);
                } else {

                }
            }
            return tasks;
        },
        addTask: function (task, callback) {
            var base = this;
            task.save({}, {
                success: function () {
                    SmartBlocks.Blocks.TaskManagement.Data.tasks.add(task);
                    base.get("tasks").add(task);
                    base.save({}, {
                        success: function () {
                            if (callback) {
                                callback();
                            }
                        }
                    });
                }
            });
        },
        removeTask: function (task) {
            var base = this;
            var index = -1;
//            var tasks = base.get("tasks");
//            for (var k in tasks) {
//                if (tasks[k].id == task.get('id')) {
//                    index = k;
//                }
//            }
//            if (index != -1) {
//                delete base.get("tasks")[index];
//            }
            base.get("tasks").remove(task);
            return index != -1;
        },
        getProject: function () {
            var base = this;
            console.log(base.attributes);
            var project = SmartBlocks.Blocks.ProjectManagement.Data.projects.get(base.get("project").id);
            return project;
        },
        save: function (attributes, options) {
            var base = this;
            var tasks_array = base.get('tasks');
            var new_array = new SmartBlocks.Blocks.TaskManagement.Collections.Tasks();
            for (var k in tasks_array.models) {
                var task = SmartBlocks.Blocks.TaskManagement.Data.tasks.get(tasks_array.models[k].get('id'));
                if (task) {
                    new_array.add(task);
                }
            }

            base.set("tasks", new_array);


            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.save.call(this, attributes, options);
        },
        destroy: function (attributes, options) {

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