define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/user_thumb.html'
], function ($, _, Backbone, user_thumb_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "user_thumb",
        initialize: function () {
            var base = this;
            base.events = $.extend({}, Backbone.Events);
        },
        init: function () {
            var base = this;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(user_thumb_tpl, {
                user: base.model
            });
            base.$el.html(template);
        },
        registerEvents: function () {
            var base = this;
        },
        setAction: function (title, callback, remove) {
            var base = this;
            var a = $(document.createElement('a'));
            a.attr('href', 'javascript:void(0);');
            a.html(title);
            base.$el.find(".actions").html(a);
            a.click(function () {
                if (callback)
                    callback(base.model);
                if (remove) {
                    base.$el.remove();
                    base.$el.slideUp(200);
                }
            });
        }

    });

    return View;
});