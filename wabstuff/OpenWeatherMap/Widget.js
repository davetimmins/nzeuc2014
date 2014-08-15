define(['dojo/_base/declare', 'jimu/BaseWidget',
'esri/request', 'esri/geometry/webMercatorUtils', 'esri/graphic', 'esri/symbols/SimpleMarkerSymbol', 'esri/geometry/Point', 'esri/Color',
'dojo/_base/lang', 'dojo/on'],
function(declare, BaseWidget,
  esriRequest, webMercatorUtils, Graphic, SimpleMarkerSymbol, Point, Color,
  lang, on) {

  return declare([BaseWidget], {

    baseClass: 'jimu-widget-openweathermap',

    name: 'OpenWeatherMap',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      esri.config.defaults.io.corsEnabledServers.push('api.openweathermap.org');
      console.log('startup');
    },

    onOpen: function(){
      console.log('onOpen');
      this.own(on(this.map, "click", lang.hitch(this, this.onMapClick)));
    },

    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    },

    onMapClick: function(evt) {
      this.execute(evt.mapPoint);
    },

    onReceiveData: function(from, path, point){
      this.execute(point);
    },

    execute: function(pt) {
      var point = webMercatorUtils.webMercatorToGeographic(pt);
      this.map.graphics.clear();
      this.map.graphics.add(new Graphic(point, new SimpleMarkerSymbol()));
      var resultsNode = this.resultsNode;
      resultsNode.innerHTML = this.config.loading;

      var map = this.map;
      var weatherRequest = esriRequest({
          url: 'http://api.openweathermap.org/data/2.5/find?lat=' + point.y + '&lon=' + point.x + '&cnt=1&APPID=' + this.config.owmAPPID,
          handleAs: "json"
        });
        // returns something like
        // {"message":"accurate","cod":"200","count":1,
        // "list":[{"id":2641549,"name":"Newtonhill","coord":{"lon":-2.15,"lat":57.033329},"main":{"temp":286.15,"pressure":1003,"humidity":93,"temp_min":286.15,"temp_max":286.15},"dt":1407102600,"wind":{"speed":4.6,"deg":170},"sys":{"country":""},"clouds":{"all":0},"weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}]}]}

        weatherRequest.then(
          function(response) {
            var result = response.list[0];
            resultsNode.innerHTML = "<p>Current weather for " + result.name + "</p>" +
             "<p><img style='vertical-align:text-top;' src='http://openweathermap.org/img/w/" + result.weather[0].icon + ".png'>" +
             "<strong> " + Math.round(result.main.temp - 273.15) + "°C </strong>" +
             result.weather[0].description + "</p>";
             map.graphics.add(new Graphic(new Point(result.coord.lon, result.coord.lat), new SimpleMarkerSymbol().setColor(new Color([255,255,0,0.5]))));
            console.log("Success");
        }, function(error) {
          resultsNode.innerHTML = error.message;
            console.log("Error: ", error.message);
        });
    }
  });
});
