define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_management.html',
    '../Subapps/ProjectIndex/Views/project_index',
    '../Subapps/ProjectShow/Views/project_show'
], function ($, _, Backbone, pm_template, ProjectIndexView, ProjectShowView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "project_management",
        initialize: function () {
            var base = this;
        },
        init: function (app) {
            var base = this;
            base.app = app;


            base.render();
            base.registerEvents();
            base.app.initRoutes({
                "": function () {
                    base.launchView(ProjectIndexView);
                },
                "index": function () {
                    base.launchView(ProjectIndexView);
                },
                "project/:id": function (id) {
                    base.launchView(ProjectShowView);
                }
            })
        },
        launchView: function (view) {
            var base = this;
            var instance = new view();
            var args = [];
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
            }
            base.$el.find('.subapp_container').html(instance.$el);
            instance.init.apply(instance, args);
        },
        render: function () {
            var base = this;

            var template = _.template(pm_template, {});
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});