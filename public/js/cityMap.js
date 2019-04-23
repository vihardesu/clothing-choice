/*
 *  CompanyMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

CityMap = function(_data, _cityloc) {
	var self = this;
	this.data = _data;
  this.city = _cityloc;
	this.initVis();
}


/*
 *  Initialize station map
 */


CityMap.prototype.initVis = function() {
	var vis = this;

  //padding for the visualization
  vis.margin = {top: 40, right: 50, bottom: 30, left: 80};

  // vis.width = 1000 - vis.margin.left - vis.margin.right;
  // vis.height = 1000 - vis.margin.top - vis.margin.bottom;
  // vis.width = 1000 - 100;
  // vis.height = 1000 - 100;

  vis.svg = d3.select("#city-map").append("svg")
      // .attr("width", vis.width)
      // .attr("height", vis.height)
      // .append("g")
      // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +")");

  vis.map = 0;

	vis.wrangleData();


}


/*
 *  Data wrangling
 */

CityMap.prototype.wrangleData = function() {
	var vis = this;


	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

CityMap.prototype.updateVis = function() {
  console.log("here");
  var vis = this;

  var city_loc = vis.city[selected_city];

  var city_data = vis.data[selected_city];

  // console.log(city_loc);

  var coordinates = [parseFloat(city_loc.lat), parseFloat(city_loc.lon) ]

  // console.log(coordinates);

  //if map already exists
  if(vis.map){

    // vis.map.off();
    vis.map.remove();

    vis.map = L.map('city-map').setView(coordinates, 13);

    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	      maxZoom: 16
      }).addTo(vis.map);

      // console.log(vis.data);


      for(var i = 0; i< city_data.length; i++){
        //console.log(city_data[i]);
        var coordinates = [parseFloat(city_data[i][5]), parseFloat(city_data[i][6]) ]

        var path = city_data[i][1]

        var myIcon = L.icon({
          iconUrl: "https://s3.amazonaws.com/streetstyle27k" + path,
          iconSize: [20, 20],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          // shadowUrl: 'my-icon-shadow.png',
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
      });
      L.marker(coordinates, {icon: myIcon}).addTo(vis.map);
        //
        // L.marker(coordinates)
        //    // .bindPopup(popupContent)
        //    .addTo(vis.map);

      }

  	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  	//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  	// }).addTo(vis.map);


  }

  else{
    vis.map = L.map('city-map').setView(coordinates, 13);

    var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
       attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
      }).addTo(vis.map);



    }


  	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  	//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  	// }).addTo(vis.map);



	// var popupContent = "<strong>Harvard, University</strong><br/>";
	// popupContent += "Boston, Massachusetts";

	// // Create a marker and bind a popup with a particular HTML content
	// var marker = L.marker([42.378774, -71.117303])
	//    .bindPopup(popupContent)
	//    .addTo(map);

	//    console.log(station);

	// var map = L.map('company-map').setView([51.505, -0.09], 13);
  //
	// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);
  //
	// L.marker([51.5, -0.09]).addTo(map)
	//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
	//     .openPopup();

}
