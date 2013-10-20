define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_show.html'
], function ($, _, Backbone, project_show_tpl) {
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
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});