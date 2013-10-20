define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_show.html',
    './deadline_thumb',
    'datejs'
], function ($, _, Backbone, project_show_tpl, DeadlineThumb, datejs) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "project_show",
        initialize: function (obj) {
            var base = this;
            base.project = obj.model;
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
                var deadline_thumb = new DeadlineThumb({model : deadlines[k]});
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
                    base.$el.find('.new_deadline_time').html('');
                    base.$el.find('.new_deadline_name').html('');
                    deadline.set('project', base.project);
                    SmartBlocks.Blocks.ProjectManagement.Data.deadlines.add(deadline);
                    deadline.save();
                }
            });

            base.$el.delegate('.add_deadline_button', 'click', function () {
                var date = datejs(base.$el.find('.new_deadline_time').val());
                base.$el.find('.result_date').html(SmartBlocks.Blocks.Time.Main.moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a"));

                if (e.keyCode == 13) {
                    var deadline = new SmartBlocks.Blocks.ProjectManagement.Models.Deadline();
                    deadline.set('name', base.$el.find('.new_deadline_name').val());
                    deadline.setDate(date);
                    base.$el.find('.result_date').html('');
                    base.$el.find('.new_deadline_time').html('');
                    base.$el.find('.new_deadline_name').html('');
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
        }
    });

    return View;
});