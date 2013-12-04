define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/users_popup.html',
    './user_thumb'
], function ($, _, Backbone, users_popup_tpl, UserThumb) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "users_popup",
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

            var template = _.template(users_popup_tpl, {});
            base.$el.html(template);
            base.updateParticipantsList();
        },
        search: function () {
            var base = this;
            var input = base.$el.find(".user_input");
            var search_terms = input.val();
            var search_words = search_terms.split(/\s/);
            var users = SmartBlocks.Blocks.Kernel.Data.users.filter(function (user) {
                return search_terms !== '' && _.some(user.attributes, function (elt) {
                    for (var k in search_words) {
                        if (typeof elt === 'string' && elt.indexOf(search_terms) != -1)
                            return true;
                    }
                    return false;
                });
            });
            base.$el.find(".search_results").html("");
            for (var k in users) {
                var user = users[k];
                var user_thumb = new UserThumb({
                    model: user
                });
                base.$el.find(".search_results").append(user_thumb.$el);
                user_thumb.init();
                user_thumb.setAction('<i class="fa fa-plus"></i> Add', function (user) {
                    base.model.addParticipant(user);
                    base.updateParticipantsList();
                });
            }
        },
        updateParticipantsList: function () {
            var base = this;
            var participants = base.model.get('participants');
            base.$el.find('.current_users_list').html('');
            for (var k in participants) {
                var parray = participants[k];
                var user = SmartBlocks.Blocks.Kernel.Data.users.get(parray.id);
                if (user) {
                    var user_thumb = new UserThumb({
                        model: user
                    });
                    base.$el.find('.current_users_list').append(user_thumb.$el);
                    user_thumb.init();
                    user_thumb.setAction('<i class="fa fa-minus"></i> Remove', function (user) {
                        base.model.removeParticipant(user);
                        base.updateParticipantsList();
                    });
                }
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate('.close_button', 'click', function () {
                base.$el.remove();
            });

            var timer = 0;
            base.$el.delegate('.user_input', 'keyup', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    base.search();
                }, 500);
            });

            base.$el.delegate('.save_button', 'click', function () {
                base.model.save();
                base.events.trigger("changed_users");
                base.$el.remove();
            });
        }
    });

    return View;
});