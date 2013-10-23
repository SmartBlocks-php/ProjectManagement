define([
    'jquery',
    'underscore',
    'backbone',
    'TaskManagement/Apps/Common/Views/task',
    'text!../Templates/tasks_list.html'
], function ($, _, Backbone, TaskView, tasks_list_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "tasks_list",
        initialize: function (obj) {
            var base = this;
            base.deadline = obj.model;
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(tasks_list_tpl, {

            });

            base.$el.html(template);
            base.renderTasks();
        },
        renderTasks: function () {
            var base = this;
            var tasks = base.deadline.getTasks();
            base.$el.find(".tasks").html('');
            for (var k in tasks) {
                var task_view = new TaskView({model: tasks[k]});
                base.$el.find(".tasks").append(task_view.$el);
                task_view.init();
            }

        },
        createTask: function () {
            var base = this;

            var task = new SmartBlocks.Blocks.TaskManagement.Models.Task();
            task.set("name", base.$el.find('.name_input').val());
            task.set('description', '');
            task.set('deadline_id', base.deadline.get('id'));
            task.save({}, {
                success: function () {
                    base.deadline.addTask(task);
                }
            });
            SmartBlocks.Blocks.TaskManagement.Data.tasks.add(task);
            base.$el.find('.name_input').val('');


        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".plus_button", "click", function () {
                base.createTask();
            });
            base.$el.delegate(".name_input", "keyup", function (e) {
                if (e.keyCode == 13) {
                    base.createTask();
                }

            });

            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("add", function (task) {
                if (task.get("deadline_id") && task.get("deadline_id") == base.deadline.get('id')) {
                    base.renderTasks();
                }
            });

//            SmartBlocks.Blocks.TaskManagement.Data.tasks.on("remove", function (task) {
//                if (task.get("deadline_id") && task.get("deadline_id") == base.deadline.get('id')) {
//                    base.renderTasks();
//                }
//            });
        }
    });

    return View;
});