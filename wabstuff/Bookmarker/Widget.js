define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    './Bookmarker'
  ],
  function(
    declare,
    lang,
    BaseWidget,
    Bookmarker) {
    var clazz = declare([BaseWidget], {

      name: 'Bookmarker',
      bookmarkerWidget: null,

      startup: function() {
        this.inherited(arguments);
        this.bookmarkerWidget = new Bookmarker({ map: this.map});
      },

      destroy: function(){

        this.inherited(arguments);
      }
    });
    return clazz;
  });
