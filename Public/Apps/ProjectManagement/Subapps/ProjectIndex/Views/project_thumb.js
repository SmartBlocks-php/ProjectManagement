define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/project_thumb.html',
    'ContextMenuView'
], function ($, _, Backbone, project_thumb_tpl, ContextMenu) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "project_thumb",
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

            var template = _.template(project_thumb_tpl, {
                project: base.project
            });
            base.$el.html(template);
            base.$el.attr('oncontextmenu', 'return false;');
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate('.change_name_button', 'click', function () {
                base.$el.find('.project_name_container').addClass('edition');
                base.$el.find('.name_input').val(base.project.get('name'));
            });

            base.$el.delegate('.name_input', 'keyup', function (e) {
                if (e.keyCode == 13) {
                    base.$el.find('.project_name_container').removeClass('edition');
                    base.project.set('name', $(this).val());
                    base.project.save();
                }

            });
            base.$el.delegate('.project_name_container', 'click', function (e) {
                e.stopPropagation();
            })

            base.$el.mouseup(function (e) {
                console.log(e.which);
                if (e.which == 3) {

                    var context_menu = new ContextMenu();
                    context_menu.addButton('View project', function () {
                        window.location = "#ProjectManagement/projects/" + base.project.get('id');
                    });
                    context_menu.addButton('Delete', function () {
                        if (confirm('Are you sure you want to delete this project ?')) {
                            base.project.destroy();
                        }
                    });
                    context_menu.show(e);
                }
            });

            $('body').click(function () {
                if (base.$el.find('.project_name_container').hasClass('edition')) {
                    base.$el.find('.project_name_container').removeClass('edition');
                    base.project.set('name', base.$el.find('.name_input').val());
                    base.project.save();
                }

            });

            base.project.on('change', function () {
                base.render();
            });
        }
    });

    return View;
});