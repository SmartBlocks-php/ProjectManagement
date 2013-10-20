define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/deadline_thumb.html'
], function ($, _, Backbone, deadline_thumb_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_thumb",
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

            var template = _.template(deadline_thumb_tpl, {
                deadline: base.deadline
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});