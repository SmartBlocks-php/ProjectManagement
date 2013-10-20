define([
    'jquery',
    'underscore',
    'backbone',
    '../Models/Project'
], function ($, _, Backbone, Project) {
    var Collection = Backbone.Collection.extend({
        model: Project,
        url: "/ProjectManagement/Projects"
    });

    return Collection;
});