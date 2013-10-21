define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_show.html',
    './deadline_thumb',
    'datejs',
    './tasks_list'
], function ($, _, Backbone, project_show_tpl, DeadlineThumb, datejs, TasksListView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "project_show",
        initialize: function (obj) {
            var base = this;
            base.project = obj.model;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(project_show_tpl, {
                project: base.project
            });
            base.$el.html(template);
            base.renderDeadlines();
        },
        renderDeadlines: function () {
            var base = this;
            base.$el.find('.deadlines').html('');
            var deadlines = base.project.getDeadlines();
            for (var k in deadlines) {
                var deadline_thumb = new DeadlineThumb({model: deadlines[k]});
                base.$el.find('.deadlines').append(deadline_thumb.$el);
                deadline_thumb.init();

            }

        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".new_deadline_time", 'keyup', function (e) {
                var date = datejs($(this).val());
                base.$el.find('.result_date').html(SmartBlocks.Blocks.Time.Main.moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a"));

                if (e.keyCode == 13) {
                    var deadline = new SmartBlocks.Blocks.ProjectManagement.Models.Deadline();
                    deadline.set('name', base.$el.find('.new_deadline_name').val());
                    deadline.setDate(date);
                    base.$el.find('.result_date').html('');
                    base.$el.find('.result_date').html('');
                    base.$el.find('.new_deadline_time').val('');
                    base.$el.find('.new_deadline_name').val('');
                    deadline.set('project', base.project);
                    SmartBlocks.Blocks.ProjectManagement.Data.deadlines.add(deadline);
                    deadline.save();
                }
            });

            base.$el.delegate('.add_deadline_button', 'click', function (e) {
                var date = datejs(base.$el.find('.new_deadline_time').val());
                base.$el.find('.result_date').html(SmartBlocks.Blocks.Time.Main.moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a"));

                if (e.keyCode == 13) {
                    var deadline = new SmartBlocks.Blocks.ProjectManagement.Models.Deadline();
                    deadline.set('name', base.$el.find('.new_deadline_name').val());
                    deadline.setDate(date);
                    base.$el.find('.result_date').html('');
                    base.$el.find('.result_date').html('');
                    base.$el.find('.new_deadline_time').val('');
                    base.$el.find('.new_deadline_name').val('');
                    deadline.set('project', base.project);
                    SmartBlocks.Blocks.ProjectManagement.Data.deadlines.add(deadline);
                    deadline.save();
                }
            });

            SmartBlocks.Blocks.ProjectManagement.Data.deadlines.on("add", function (deadline) {
                if (deadline.get('project').id == base.project.get('id')) {
                    base.renderDeadlines();
                }
            });

            SmartBlocks.Blocks.ProjectManagement.Data.deadlines.on("remove", function (deadline) {
                if (deadline.get('project').id == base.project.get('id')) {
                    base.renderDeadlines();
                }
            });

            base.$el.delegate('.deadline_thumb', 'click', function () {
                var id = $(this).attr("data-id");
                base.selected_deadline = SmartBlocks.Blocks.ProjectManagement.Data.deadlines.get(id);

                if (base.selected_deadline) {
                    base.$el.find(".deadline_thumb.selected").removeClass("selected");
                    $(this).addClass("selected");
                    base.events.trigger("selected_deadline", base.selected_deadline);

                }

            });

            base.events.on('selected_deadline', function () {
                var tasks_list_view = new TasksListView({model: base.selected_deadline});
                base.$el.find(".tasks_list_container").html(tasks_list_view.$el);
                tasks_list_view.init();
            });


        }
    });

    return View;
});