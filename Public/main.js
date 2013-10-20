define([
    'jquery',
    'underscore',
    'Backbone',
    './Apps/ProjectManagement/Views/project_management'
], function ($, _, Backbone, ProjectManagementView) {
    var main = {
        init: function () {

        },
        launch_pm: function (app) {
            console.log("launched view");
            var project_management_view = new ProjectManagementView();
            SmartBlocks.Methods.render(project_management_view.$el);
            project_management_view.init(app);
        }
    };

    return main;
});