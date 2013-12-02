define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/timeline.html'
], function ($, _, Backbone, timeline_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "timeline",
        initialize: function () {
            var base = this;
        },
        init: function (tasks) {
            var base = this;

            base.render();
            base.registerEvents();
            base.moving = false;
            base.lastx = undefined;
            base.current_trans = 0;
            base.tasks = tasks;
        },
        render: function () {
            var base = this;

            var template = _.template(timeline_tpl, {});
            base.$el.html(template);

            base.$canvas = base.$el.find("canvas");
            base.$canvas.attr("width", base.$el.width());
            base.$canvas.attr("height", base.$el.height());
            base.canvas = base.$canvas[0];

            base.update();
        },
        update: function () {
            var base = this;
            var canvas = base.canvas;

            base.$canvas.attr("width", base.$el.width());
            base.$canvas.attr("height", base.$el.height());

            var ctx = canvas.getContext('2d');

            var now = new Date();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var rect_width = 60;
            var margin_width = 10;
            var hour_height = 10;
            var rect_color = "red";
            if (base.moving) {

                if (base.lastx && !base.translated) {
                    var delta = base.lastx - base.current_x;
                    base.current_trans -= delta;
                    base.translated = true;
                }
            } else {
                base.current_trans *= 0.9;
            }
            ctx.translate(base.current_trans + canvas.width / 2 - rect_width / 2, 0);


            for (var i = -30; i <= 30; i++) {
                var day = new Date(now);
                day.setDate(day.getDate() + i);
                var day_start = new Date(day);
                day_start.setHours(0, 0, 0);
                var day_end = new Date(day);
                day_end.setHours(23, 59, 59);

                var cumulated_total = 0;
                var cumulated_left = 0;
                var cumulated_done = 0;

                for (var k in base.tasks) {
                    var task = base.tasks[k];
                    cumulated_total += task.getDuration(day_start, day_end)
                    cumulated_left += task.getLeftDuration(day_start, day_end)
                    cumulated_done += task.getDoneDuration(day_start, day_end)
                }
                var info = {
                    total: cumulated_total,
                    done: cumulated_done,
                    left: cumulated_left
                };

                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.fillRect(i * rect_width + i * margin_width, 0, rect_width, canvas.height - 20);


                var height = info.total * hour_height / 3600000;
                var done_height = info.done * hour_height / 3600000;
                var left_height = info.left * hour_height / 3600000;
                ctx.fillStyle = "rgba(0,255,0,0.1)";
                ctx.fillRect(i * rect_width + i * margin_width, canvas.height - done_height - 20, rect_width, done_height);
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.fillRect(i * rect_width + i * margin_width, canvas.height - left_height - done_height - 20, rect_width, left_height);
                ctx.fillStyle = "white";
                var text = (height / 10).toFixed(1) + "h";
                var tmes = ctx.measureText(text);
                ctx.fillText(text, (i * rect_width + i * margin_width) + (rect_width - tmes.width) / 2, canvas.height - height + 10 - 20);
                ctx.fillStyle = "black";
                var text = day.getMonthName() + " " + day.getDate();
                var tmes = ctx.measureText(text);
                ctx.fillText(text, (i * rect_width + i * margin_width) + (rect_width - tmes.width) / 2, canvas.height);
            }

            if (base.$el.width() > 0) {
                requestAnimationFrame(function () {
                    base.update();
                }, base.canvas);
            }
        },
        setTasks: function (tasks) {
            var base = this;
            if (tasks.models) {
                base.tasks = tasks.models;
            } else {
                base.tasks = tasks;
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.mousedown(function (e) {
                base.moving = true;
                base.lastx = base.current_x;
                base.current_x = e.pageX - base.$canvas.offset().left;
                base.$el.css("cursor", "-webkit-grabbing");
            });
            base.$el.mousemove(function (e) {
                base.lastx = base.current_x;
                base.current_x = e.pageX - base.$canvas.offset().left;
                base.translated = false;
            });
            $(document).mouseup(function (e) {
                base.moving = false;
                base.$el.css("cursor", "-webkit-grab");
            });
        }
    });

    return View;
});