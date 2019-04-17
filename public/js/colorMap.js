
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

    //Title
    svgGroup.append("text")
    	.attr("y", -9)
    	.text("Color Map by City")

    //Tiled Images - Legend
    var barlegendGroup = svgGroup.append("g")
    	.attr("class", "barLegend")
    	.attr("transform", "translate(" + 87 + "," + -20 + ")");

    barlegendGroup.append("rect")
    	.attr("height", 13)
    	.attr("width", 13)
        .attr("x", self.svgWidth - 220);

    barlegendGroup.append("text")
    	.attr("x", self.svgWidth - 200)
    	.attr("y", 11)
        .style("fill", "black")
    	.text("Instagram Image")

    //Y Axis
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
	//console.log("gets here");
	var city = "Bangkok";
	var selectedCity = this.data[city];
	//console.log(selectedCity);

	var imageObjects = [];
	var color_set = new Set();

	//We want a tiled bar chart that can sort by color and image
	selectedCity.forEach(function (d,i){
		d.color = d[14];
		d.url = d[1];

		instagramImage = {
			city: city,
			color: d.color,
			url: d.url
		}

		color_set.add(d.color);
		imageObjects.push(instagramImage);
        //console.log(imageObjects);

	});

	//console.log(color_set);

    var sortedByColor = [];
	
    imageObjects.sort(function(a, b) {
        if(a.color < b.color){
            return -1;
        }else if(a.color > b.color){
            return 1;
        }else{
            return 0;   
        }
    });

    console.log(imageObjects);

    console.log(getTiles(34));
    //updateBar(34);


	// Update the visualization
	vis.updateVis();

}

//Helper function for data wrangling.
//Modified from Source: https://flowingdata.com/2018/09/20/tiled-bar-chart-d3-js/
function getTiles(num) {
  var tiles = [];
  var tilesPerRow = 5;
  var tileSize = 15;

   
  for(var i = 0; i < num; i++) {
    var rowNumber = Math.floor(i / tilesPerRow);
    tiles.push({
      x: (i % tilesPerRow) * tileSize,
      y: -(rowNumber + 1) * tileSize
    });
  }
   
  return tiles
}

//Helper function for bar creation
//Modified from source: https://flowingdata.com/2018/09/20/tiled-bar-chart-d3-js/

// function updateBars(d, i) {

//   //filler
//   var tiles = getTiles(34);

//   var tilesPerRow = 5;
//   var tileSize = 15;
//   var barPadding = 20;
//   var maxValue = 100;

//   var barWidth = (tilesPerRow * tileSize) + barPadding;

//   var u = d3.select(this)
//     .attr("transform", "translate(" + i * barWidth + ", 300)")
//     .selectAll("rect")
//     .data(tiles);

//   u.enter()
//     .append("rect")
//     .style("opacity", 0)
//     .style("stroke", "white")
//     .style("stroke-width", "0.5")
//     .style("shape-rendering", "crispEdges")
//     .merge(u)
//     .attr("x", function(d) {
//       return d.x;
//     })
//     .attr("y", function(d) {
//       return d.y;
//     })
//     .attr("width", tileSize)
//     .attr("height", tileSize)
//     .transition()
//     .delay(function(d, i) {
//       return i * 20;
//     })
//     .style("opacity", 1);


//   u.exit()
//     .transition()
//     .delay(function(d, i) {
//       return (100 - i) * 20;
//     })
//     .style("opacity", 0)
//     .on("end", function() {
//       d3.select(this).remove();
//     });
// }


/*
 *  The drawing function
 */

ColorMap.prototype.updateVis = function() {

	//console.log("here");

}
