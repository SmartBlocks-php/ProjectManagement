define([
    'jquery',
    'underscore',
    'backbone',
    '../Models/ProjectRequest'
], function ($, _, Backbone, ProjectRequest) {
    var Collection = Backbone.Collection.extend({
        model: ProjectRequest,
        url: "/ProjectManagement/ProjectRequests"
    });

    return Collection;
});