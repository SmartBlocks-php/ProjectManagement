define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ProjectManagement/Projects",
        getDeadlines: function () {
            var base = this;
            var deadlines = SmartBlocks.Blocks.ProjectManagement.Data.deadlines.filter(function (deadline) {
                return deadline.get("project") && deadline.get("project").id == base.get("id");
            });
            return deadlines;
        },
        getTasks: function () {
            var base = this;
            var tasks = [];
            var deadlines = base.getDeadlines();
            for (var k in deadlines) {
                var d_tasks = deadlines[k].getTasks();
                for (var i in d_tasks) {
                    tasks.push(d_tasks[i]);
                }
            }
            return tasks;
        },
        addParticipant: function (user) {
            var base = this;

            if (!base.get('participants')) {
                base.set('participants', []);
            }

            base.get('participants').push(user.attributes);
        },
        removeParticipant: function (user) {
            var base = this;
            var new_array = [];

            var participants = base.get('participants');
            for (var k in participants) {
                var u_array = participants[k];
                if (user.get('id') != u_array.id) {
                    new_array.push(u_array);
                }
            }
            base.set('participants', new_array);
        },
        save: function (attributes, options) {
            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.save.call(this, attributes, options);
        },
        destroy: function (attributes, options) {

            var base = this;
            var deadlines = base.getDeadlines();
            for (var j in deadlines) {
                deadlines[j].destroy();
            }

            attributes || (attributes = {});
            attributes['headers'] = {'If-Match': this.get("rev")};
            Backbone.Model.prototype.destroy.call(this, attributes, options);
        },
        getTimeInfo: function (start, end) {
            var base = this;
            var tasks = base.getTasks();
            var time_info = {
                total: 0,
                left: 0,
                done: 0
            };

            for (var k in tasks) {
                var task = tasks[k];
                time_info.total = task.getDuration(start, end);
                time_info.left = task.getLeftDuration(start, end);
                time_info.done = task.getDoneDuration(start, end);
            }

            return time_info;
        }
    });
    return Model;
});