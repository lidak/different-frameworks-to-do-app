'use strict';

$(function() {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': function () {
                var Collection = Backbone.Collection.extend({
                    model: Model
                });

                var firstToDoView = new AppView({
                    collection: new Collection()
                });
                $('#application').html(firstToDoView.render());
            },
            'some': function () {
                $('#application').html('<h1>Some</h1>');
            }
        }
    });

    var Model = Backbone.Model.extend({ 
        defaults: {
            title: 'Unnamed Job',
            done: false,
            mode: 'show'
        }
    });


    var View = Backbone.View.extend({
        template: _.template(
            '<h3 class="to-do-title"><%= title %></h3>' +
            '<div class="remove-to-do-item">x</div>' +
            '<input type="checkbox"'+
                '<% if (done){ %>' +
                    ' checked="checked"'+
                '<% }%>' +
            '>'+        
            '<% if (mode === \'edit\'){ %>' +
                '<input type="text" class="edit-title" value="<%= title %>">' +
            '<% }%>'

        ),
        className: 'to-do-item',
        tagName: 'li',

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        events: {
            'keypress .edit-title': 'titleInputPressed',
            'dblclick .to-do-title': 'startTitleEdition',
            'click .remove-to-do-item': 'removeToDoItem'
        },

        render: function() {
            var self = this;

            this.$el.html(this.template(this.model.toJSON()));

            if (this.model.get('mode') === 'edit') {
                _.defer(function() {self.$('.edit-title').focus();});
            }
            return this.el;
        },

        titleInputPressed: function (e) {
            if (e.keyCode === 13) {
                this.model.set({
                    title: this.$('.edit-title').val(),
                    mode: 'show'
                });
            }
        },

        startTitleEdition: function () {
            this.model.set({
                mode: 'edit'
            });
        },

        removeToDoItem: function () {
            this.model.destroy();
            this.remove();
        }
    });

    var AppView = Backbone.View.extend({
        $el: $('#application'),
        template: _.template(
            '<span class="add-to-do">New</span>' +
            '<ul class="to-dos-container"></ul>'
        ),
        events: {
            'click .add-to-do': 'addToDo'
        },
        initialize: function () {
            this.collection.on('add', this.renderOne, this);
        },
        render: function () {
            this.$el.html(this.template({}));
            //this.renderAll();
            return this.el;
        },
        addToDo: function () {
            this.collection.add({mode:'edit', title: ''});
        },
        renderOne: function (model) {
            var newToDo = new View({model: model});

            this.$el.find('.to-dos-container').append(newToDo.render());
        }
    });


    var appRouter = new AppRouter;

    Backbone.history.start();

});
