
    
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

cityLocationArray = [["Bangkok", 13.787436658, 100.496136909],
["Beijing", 39.967228333, 116.317658333],
["Bogota", 4.533531005, -74.088131216],
["Buenos Aires", -34.7015543, -58.3739383],
["Cairo", 30.016333, 31.2423508],
["Delhi", 28.577473406, 77.376687108],
["Dhaka", 23.7019921, 90.417867],
["Guangzhou", 23.184594079, 113.220501104],
["Istanbul", 41.033093439, 28.97659244],
["Jakarta", -6.23284927, 106.86414185],
["Karachi", 24.9072427, 66.972015],
["Kolkata", 22.614825, 88.435913333],
["Lagos", 6.65598646, 3.33248304],
["London", 51.508414267, -0.143360077],
["Los Angeles", 34.0433305, -118.257071667],
["Manila", 14.607481892, 121.098990672],
["Mexico City", 19.2907461, -98.9332553],
["Mumbai", 18.931296194, 72.827788],
["New York City", 40.645391336, -73.983963607],
["Osaka", 34.671688333, 135.496338333],
["Rio de Janeiro", -22.977830177, -43.194346286],
["Sao Paulo", -23.527833333, -46.67],
["Seoul", 37.558782113, 126.803019047],
["Shanghai", 31.123586167, 121.38703],
["Tianjin", 39.113660343, 117.212214253],
["Tokyo", 35.670138333, 139.761261667],
["Paris", 48.855186801, 2.361205553],
["Berlin", 52.494104093, 13.436008752],
["Madrid", 40.447516917, -3.695172329],
["Kiev", 50.467603333, 30.515995],
["Rome", 41.894599, 12.483092]]; 


  console.log(cityLocationArray);
  var vis = this;

  var city_loc = vis.city[selected_city];

  var city_data = vis.data[selected_city];

  console.log(city_loc);

  var lattitude = 0;
  var longitude = 0;

  for (var i = 0; i<31; i++){
    if(selected_city == cityLocationArray[i][0]){
      lattitude = cityLocationArray[i][1]; 
      longitude = cityLocationArray[i][2];
    }
  }






  var coordinates = [lattitude, longitude]

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

      //var myMarker = L.marker(coordinates)

      //var myIcon = L.Icon({className: 'my-div-icon'});

      L.marker(coordinates
         ,{icon: myIcon}
          )
            .addTo(vis.map)
            .bindPopup(

              function(d, i){
                // console.log(d); 
                console.log(i); 

                return "<img src=" + d['_icon']['currentSrc'] + ">"; 

              }
            )
            //.openPopup();


        //console.log(marker); 

        // marker.bindPopup("Popup content");
        // marker.on('mouseover', function (e) {
        //     this.openPopup();
        // });
        // marker.on('mouseout', function (e) {
        //     this.closePopup();
        // });
        //
        // L.marker(coordinates)
        //    .bindPopup(popupContent)
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

