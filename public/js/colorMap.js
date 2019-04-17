
/*
 *  ColorMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

ColorMap = function(_data) {
	var self = this;
	this.data = _data;
	this.initVis();
}


/*
 *  Initialize station map
 */


ColorMap.prototype.initVis = function() {
    var self = this;
    self.margin = {top: 30, right: 30, bottom: 30, left: 30};

    //Gets access to the div element created for this chart from HTML
    var divColorMap = d3.select("#color-map").classed("content", true);
    self.svgBounds = divColorMap.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 370;

    //creates svg element within the div
    self.svg = divColorMap.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .attr("id", "color-map-svg")

    var svgGroup = self.svg.append("g")
        .attr('width', self.svgWidth)
        .attr('height', self.svgHeight)
        .attr('id', "color-map-group")
        .attr('transform', "translate(" + 20 + "," + 40 + ")");

    svgGroup.append("text")
    	.attr("y", -9)
    	.text("Color Map")

    var legendGroup = svgGroup.append("g")
    	.attr("class", "legend")
    	.attr("transform", "translate(" + 87 + "," + -20 + ")");

    legendGroup.append("rect")
    	.attr("height", 13)
    	.attr("width", 13);

    legendGroup.append("text")
    	.attr("x", 17)
    	.attr("y", 11)
    	.text("Color")

    svgGroup.append("g")
    	.attr("class", "y axis");

    svgGroup.append("g")
    	.attr("class", "bars")
    	.attr("transform", "translate(" + 10 + "," + 0 + ")");

	//console.log(this.data.Bangkok);
	self.wrangleData();
}


/*
 *  Data wrangling
 */

ColorMap.prototype.wrangleData = function() {
	var vis = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	//Wrangle Data
	console.log("gets here");
	var city = "Bangkok";
	var selectedCity = this.data[city];
	console.log(selectedCity);

	var imageObjects = [];
	var color_set = new Set();

	//We want a tiled bar chart that can sort by color and image
	selectedCity.forEach(function (d){
		d.color = d[14];
		d.url = d[1];

		instagramImage = {
			city: city,
			color: d.color,
			url: d.url
		}

		color_set.add(d.color);
		imageObjects.push(instagramImage);

	});

	console.log(color_set);
	console.log(imageObjects);

	// Update the visualization
	vis.updateVis();

}


/*
 *  The drawing function
 */

ColorMap.prototype.updateVis = function() {

	console.log("here");

}
