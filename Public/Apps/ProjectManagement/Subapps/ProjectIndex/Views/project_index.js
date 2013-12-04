define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_index.html',
    'text!../Templates/add_project.html',
    './project_thumb',
    '../../Views/timeline'
], function ($, _, Backbone, project_index_tpl, project_add_tpl, ProjectThumb, TimelineView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "project_index",
        initialize: function () {
            var base = this;
            base.current_page = 1;
            base.page_size = 11;
            base.page_count = 0;
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();
        },
        computeTasks: function () {
            var base = this;
            var projects = SmartBlocks.Blocks.ProjectManagement.Data.projects.models;
            var tasks = [];
            for (var k in projects) {
                var ptasks = projects[k].getTasks();
                for (var i in ptasks) {
                    tasks.push(ptasks[i]);
                }
            }
            return tasks;
        },
        render: function () {
            var base = this;

            var template = _.template(project_index_tpl, {});
            base.$el.html(template);
            base.updateListSize();

            base.timeline = new TimelineView();
            base.$el.find(".timeline_container").html(base.timeline.$el);
            base.timeline.$el.css("height", "100%");
            base.timeline.init(base.computeTasks());
        },
        renderProjects: function (page) {
            var base = this;
            if (page)
                base.current_page = page;

            var projects = SmartBlocks.Blocks.ProjectManagement.Data.projects;
            base.page_count = Math.ceil(projects.models.length / base.page_size);

            if (base.current_page < 1) {
                base.current_page = 1;
            }
            if (base.current_page > base.page_count) {
                base.current_page = base.page_count;
            }

            var page_start = (base.current_page - 1) * base.page_size;
            var page_end = page_start + base.page_size;

            var projects_to_show = projects.slice(page_start, page_end);

            base.$el.find(".project_list").html('');

            for (var k in projects_to_show) {
                var project = projects_to_show[k];
                var project_thumb = new ProjectThumb({model: project});
                base.$el.find(".project_list").append(project_thumb.$el);
                project_thumb.init();
            }

            base.$el.find(".project_list").append(project_add_tpl);

            base.$el.find(".pagination").html("");
            for (var i = 1; i <= base.page_count; i++) {
                var link = $('<a href="javascript:void(0)" class="page_button' + (i == base.current_page ? ' selected' : '') + '" data-page="' + i + '"><div></div></a>');
                base.$el.find(".pagination").append(link);
            }

        },
        updateListSize: function () {
            var base = this;
            base.$el.find(".project_list").css("width", "auto");
            var available_cols = Math.floor(base.$el.find(".project_list").width() / 240);
            var available_rows = Math.floor(base.$el.find(".project_list").height() / 130);
            base.page_size = available_cols * available_rows - 1;
            if (base.page_size > 0) {
                base.renderProjects();
            }
            base.$el.find(".project_list").css("width", available_cols * 240);
            console.log(base.page_size);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".project_thumb.plus", "click", function () {
                var project = new SmartBlocks.Blocks.ProjectManagement.Models.Project();
                project.set('name', 'new project');
                project.set('description', 'The project\'s description');
                project.save();
                SmartBlocks.Blocks.ProjectManagement.Data.projects.add(project);

            });

            SmartBlocks.Blocks.ProjectManagement.Data.projects.on("add", function () {
                base.renderProjects(base.current_page);
            });

            SmartBlocks.Blocks.ProjectManagement.Data.projects.on("remove", function () {
                base.renderProjects(base.current_page);
            });

            base.$el.delegate('.pagination a', 'click', function () {
                var elt = $(this);
                base.renderProjects(elt.attr('data-page'));
            });

            $(window).resize(function () {
                base.updateListSize();
            });

            base.$el.delegate('.project_thumb', 'mouseover', function () {
                var $elt = $(this);
                var project = SmartBlocks.Blocks.ProjectManagement.Data.projects.get($elt.attr('data-id'));
                if (project && base.current_project != project) {
                    base.current_project = project;
                    base.tasks = project.getTasks();
                    base.timeline.setTasks(base.tasks);
                    $elt.bind("mouseout", function () {
                        base.timeline.setTasks(base.computeTasks());
                        base.current_project = undefined;
                        $(this).unbind("mouseout");
                    });
                }

            });

        }
    });

    return View;
});