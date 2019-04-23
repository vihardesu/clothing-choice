
/*
 *  CompanyMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

CompanyMap = function(_data) {
	var self = this;
	this.data = _data;
	this.initVis();
}


/*
 *  Initialize station map
 */


CompanyMap.prototype.initVis = function() {
	var vis = this;
	vis.wrangleData();

}


/*
 *  Data wrangling
 */

CompanyMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

CompanyMap.prototype.updateVis = function() {

  //coordinates = [42.360081, -71.058884];

 //  var map = L.map('station-map').setView([42.360081, -71.058884], 13);

	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);

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
