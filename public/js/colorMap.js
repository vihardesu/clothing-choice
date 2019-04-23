
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
    self.margin = {top: 50, right: 30, bottom: 50, left: 30};

    //Gets access to the div element created for this chart from HTML
    var divColorMap = d3.select("#color-map").classed("content", true);
    self.svgBounds = divColorMap.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgPaddedHeight = 800;

    // self.axisHeight = 900;

    //creates svg element within the div
    self.svg = divColorMap.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgPaddedHeight + self.margin.top+self.margin.bottom)
        .attr("id", "color-map-svg")

    self.defs = self.svg.append('defs');

    var svgGroup = self.svg.append("g")
        .attr('width', self.svgWidth)
        .attr('height', self.svgPaddedHeight)
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
        .attr("x", 180);

    barlegendGroup.append("text")
    	.attr("x", 200)
    	.attr("y", 11)
        .style("fill", "black")
    	.text("Instagram Image")

    //Y Axis
    svgGroup.append("g")
    	.attr("class", "y_axis");

    svgGroup.append("g")
    	.attr("class", "bars")
    	.attr("transform", "translate(" + 10 + "," + 0 + ")");

    //X Axis Colors
    var colors = ["Uncategorized", "Black", "Blue", "Brown", "Gray", "Green", "More than 1 color", "Orange", "Pink", "Purple", "Red", "White", "Yellow"];
    // var ordinalScale = d3.scaleOrdinal()
    //   .domain(colors)
    //   .range([0, self.svgWidth]);

    var xAxis = svgGroup.append('g')
        .attr("class", "x_axis");


    var xRects = d3.select('.x_axis').selectAll("rect")
        .data(colors);

    var spacing = 100;

    xRects.enter().append("rect")
        //Matches bars
        .attr("x", function(d, index) {


            return (index * spacing);
             })
        .attr("y", 785)
        .attr("height", 18)
        .attr("width", 100)
        .attr("fill", 'black')
        .style("stroke", function(d){

            if (d == "Black"){
                return "white"
            }
            else {
                return "black";
            }
        })
        .style("stroke-width", "0.5")
        .style("shape-rendering", "crispEdges")
        .attr("fill",
            function(d){
            if (d == "Uncategorized"){
                return "white"
            }
            if (d == "More than 1 color"){
                return "white"
            }
            return d;
        });

    var xLabels = xAxis.selectAll("text")
        .data(colors);

    xLabels.enter().append('text')
        .attr("x", function(d, index) {

            return (index * spacing);
             })
        .attr("y", 830)
        .style("fill", "black")
        .text(function(d){ return d})
    // Enter (initialize the newly added elements)
    // var circleEnter = circle.enter().append("circle")
    //     .attr("r", 10)
    //     .attr("cx", function(d, index) { return (index * 55) + 33 })
    //     .attr("cy", 50)
    //     .attr("class", function(d, index) {
    //         //console.log(self.chooseClass(self.electionWinners[index].PARTY));
    //         return self.chooseClass(self.electionWinners[index].PARTY);
    //     });
    // barlegendGroup.append("text")
    //     .attr("x", 200)
    //     .attr("y", 11)
    //     .style("fill", "black")
    //     .text("Instagram Image")

	//console.log(this.data.Bangkok);
	self.wrangleData();
}


/*
 *  Data wrangling
 */

ColorMap.prototype.wrangleData = function() {
	var self = this;

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	console.log(selected_city);

	//Wrangle Data
	var selectedCity = this.data[selected_city];
	//console.log(selectedCity);

	var imageObjects = [];
	var color_set = new Set();

	//We want a tiled bar chart that can sort by color and image
	selectedCity.forEach(function (d,i){
		d.color = d[14];
		d.url = d[1];

		instagramImage = {
			city: selected_city,
			color: d.color,
			url: d.url

		}

		color_set.add(d.color);
		imageObjects.push(instagramImage);
        //console.log(imageObjects);

	});

	//console.log(color_set);

    imageObjects.sort(function(a, b) {
        if(a.color < b.color){
            return -1;
        }else if(a.color > b.color){
            return 1;
        }else{
            return 0;
        }
    });

    // console.log(imageObjects);

    //_.groupBy(imageObjects, "color");
    //console.log(imageObjects);
    var sortedColorArray = groupBy2(imageObjects, "color")

    // console.log(sortedColorArray);

    var tilesPerRow = 5;
    var tileSize = 15;
    var barPadding = 30;
    var barWidth = (tilesPerRow * tileSize) + barPadding;

    var xAxisPadding = 50;

    var index = 0;

    var AJUST_WIDTH_VIHAR = 900;

    for (var color in sortedColorArray){
    // sortedColorArray.forEach(function(color, i){
        // console.log(sortedColorArray[color].length);

        var x = index*(AJUST_WIDTH_VIHAR/(Object.keys(sortedColorArray).length) + barPadding);
        // console.log(x);

        var y = self.svgPaddedHeight - xAxisPadding;

        // console.log(color);

        for(var i = 0; i< sortedColorArray[color].length; i++){
            var rowNumber = Math.floor(i / tilesPerRow);
            sortedColorArray[color][i].x = x + (i % tilesPerRow) * tileSize;
            sortedColorArray[color][i].y = y + (-(rowNumber + 1) * tileSize);
        }
        index = index + 1;
        // colorsArray.push(getTiles(sortedColorArray[color].length));
    }

    var arr = [];

    for (var key in sortedColorArray) {
        if (sortedColorArray.hasOwnProperty(key)) {
            arr.push(  sortedColorArray[key] );
        }
    }

    var merged = [].concat.apply([], arr);

    // console.log(merged);

	//self.updateVis(sortedColorArray);
    self.updateVis(merged);

}


//Helper Function for breaking down objects by color
//Source: https://stackoverflow.com/questions/14696326/break-array-of-objects-into-separate-arrays-based-on-a-property
function groupBy2(xs, prop) {
  var grouped = {};
  // var grouped = [];
  for (var i=0; i<xs.length; i++) {
    var p = xs[i][prop];
    if (!grouped[p]) { grouped[p] = []; }
    grouped[p].push(xs[i]);
    // grouped[p].append(xs[i]);
  }
  return grouped;
}



//Helper function for bar creation
//Modified from source: https://flowingdata.com/2018/09/20/tiled-bar-chart-d3-js/

ColorMap.prototype.updateVis = function(merged) {
    var self = this;

	//console.log("here");
    //console.log(sortedColorArray["Black"].length);



    //append x and y key-values to each image in the data set
    //draw tiles based on that data;


    //sortedColorArray['x'].push(colorsArray[]);

    // console.log(colorsArray);

    //console.log(sortedColorArray);
    var tilesPerRow = 5;
    var tileSize = 15;
    var barPadding = 20;
    var maxValue = 250;

    //var barWidth = (tilesPerRow * tileSize) + barPadding;


  var img_id = function(d, i){ return "img_" + i; }
  var img_url = function(d,i){ return "url(#img_" + i + ")"; }
  //var img_url = function(d){ return "url(https://s3.amazonaws.com/streetstyle27k" + d.url + ")"; }

  var imagePatterns = self.defs.selectAll('pattern')
            .data(merged)
            .enter()
            .append("pattern")
            .attr("id", img_id)
            .attr("width", 15)
            .attr("height", 15)
            .attr("patternUnits", "objectBoundingBox")
        .append("image")
            .attr("x", function(d, i) {
              return 0;
            })
            .attr("y", function(d) {
              return 0;
            })
            .attr("width", tileSize)
            .attr("height", tileSize)
            .attr("xlink:href", function(d) {
              var path = d.url;
              //console.log(path)
              var img = "https://s3.amazonaws.com/streetstyle27k" + path;
              return img;
            });


  //console.log(colorBar);

  var tooltip = d3.select("#color-map").append("div")
    .attr("class", "tooltip")
    .style("opacity", .5);

    var colorBar = d3.select(".bars")
        //.attr("transform", "translate(" + i * barWidth + ", 300)")
        .selectAll('rect')
        .data(merged);

    colorBar.enter()
            .append('rect')
            .style("stroke", function(d){

                if (d.color == "Black"){
                    return "white"
                }
                else {
                    return "black";
                }
            })
            .style("stroke-width", "0.5")
            .style("shape-rendering", "crispEdges")
            .merge(colorBar)
            .attr("x", function(d, i) {

              return d.x;
            })
            .attr("y", function(d) {
              return d.y;
            })
            .attr("width", tileSize)
            .attr("height", tileSize)
            .attr("fill", img_url)
            // .attr("fill",
            //     function(d){
            //     if (d.color == ""){
            //         return "white"
            //     }
            //     if (d.color == "More than 1 color"){
            //         return "white"
            //     }
            //     return d.color;
            //   // var path = d.url;
            //   // //console.log(path)
            //   // var string = "url(https://s3.amazonaws.com/streetstyle27k" + path +")";

            //   // var img = "https://s3.amazonaws.com/streetstyle27k" + path;

            //   // return img;

            // }
            //)
            .style("opacity", 1);
            // .on("mouseover", function (d, i) {

            //   var path = d.url;
            //   //console.log(path)
            //   var string = "<img src=https://s3.amazonaws.com/streetstyle27k" + path +" />";

            //   tooltip.html(string)
            //         .style("left", 10 + "px")
            //         .style("top", 10 + "px")
            //         .style("display", "inline-block");
            // })
            // .on("mouseout", function (d) {

            //     //tooltip.style("opacity", 0);
            //     tooltip.style("display", "none");
            // });


            // .append("image")
            //     .attr("x", function(d, i) {

            //       return d.x;
            //     })
            //     .attr("y", function(d) {
            //       return d.y;
            //     })
            //     .attr("width", tileSize)
            //     .attr("height", tileSize)
            //     .attr("xlink:href", function(d) {
            //         var path = d.url;
            //         //console.log(path)
            //         var string = "https://s3.amazonaws.com/streetstyle27k" + path;

            //       return string;
            //     });





            // .delay(function(d, i) {
            //   return i * 20;
            // })
            // .transition()
            // ;

        // var labels = colorBar.select("text")
        //       .append("text")
        //       .attr("y", -4)
        //       .style("font-weight", "bold")
        //       .style("font-size", "12px")
        //       .style("fill", "#777")
        //       .text("Black");





          //Y Axis Code
          //var chartWidth = (14*tilesPerRow*tileSize+barPadding);
          var chartWidth = self.svgWidth - 100;
          var chartHeight = self.svgPaddedHeight - 50;
          //var chartHeight = (maxValue / tilesPerRow) * tileSize;

          var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
          var yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

          // console.log(yAxis);

          d3.select(".y_axis")
            .call(yAxis);

          //X Axis Code
         // var x = d3.scaleBand().rangeRound([0, chartWidth]).padding(0.1);
         //    x.domain(["apple", "orange", "banana", "grapefruit"]);

            // var ordinalScale = d3.scaleOrdinal()
            //   .domain(["apple", "orange", "banana", "grapefruit"])
            //   .range([0, self.svgWidth]);

            // d3.select(".x_axis")
            //     .call(ordinalScale);

            // self.svg.append("g")
            //     .attr("class", "x_axis")
            //     .call(ordinalScale);






}

//Helper function for data visualization creation.
//Modified from Source: https://flowingdata.com/2018/09/20/tiled-bar-chart-d3-js/
function getTiles(num) {
  var tiles = [];
  var tilesPerRow = 5;
  var tileSize = 15;


  for(var i = 0; i < num; i++) {
    var rowNumber = Math.floor(i / tilesPerRow);

    // tiles.push({
    //   x: (i % tilesPerRow) * tileSize,
    //   y: -(rowNumber + 1) * tileSize
    // });
  }

  return tiles
}
