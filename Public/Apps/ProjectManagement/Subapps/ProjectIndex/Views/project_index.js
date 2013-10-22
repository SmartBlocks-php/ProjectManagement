define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_index.html',
    'text!../Templates/add_project.html',
    './project_thumb'
], function ($, _, Backbone, project_index_tpl, project_add_tpl, ProjectThumb) {
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
        render: function () {
            var base = this;

            var template = _.template(project_index_tpl, {});
            base.$el.html(template);
            base.renderProjects(base.current_page);
        },
        renderProjects: function (page) {
            var base = this;
            if (page)
                base.current_page = page;

            var projects = SmartBlocks.Blocks.ProjectManagement.Data.projects;
            base.page_count =  Math.ceil(projects.models.length / base.page_size);

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
        }
    });

    return View;
});