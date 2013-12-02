define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {

        },
        urlRoot: "/ProjectManagement/ProjectRequests"
    });

    Model.RequestedMe = function () {
        var pr = SmartBlocks.Blocks.ProjectManagement.Data.project_requests.filter(function (pr) {
            return pr.get('target_user').id == SmartBlocks.current_user.get('id')
        });
        return new SmartBlocks.Blocks.ProjectManagement.Collections.ProjectRequests(pr);
    };

    Model.RequestedOthers = function () {
        var pr = SmartBlocks.Blocks.ProjectManagement.Data.project_requests.filter(function (pr) {
            return pr.get('target_user').id != SmartBlocks.current_user.get('id')
        });
        return new SmartBlocks.Blocks.ProjectManagement.Collections.ProjectRequests(pr);
    };
    return Model;
});