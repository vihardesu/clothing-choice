
/*
 *  ColorMap - Object constructor function
 */

ColorMap = function(_data) {
	var self = this;
	this.data = _data;
	this.initVis();
}

//Initialize Color Map
ColorMap.prototype.initVis = function() {

    //Global Variables for Bar Construction
    var self = this;
    self.tilesPerRow = 5;
    self.tileSize = 15;
    self.barPadding = 30;
    self.barWidth = (self.tilesPerRow * self.tileSize) + self.barPadding;



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
        .attr("height",self.svgPaddedHeight + self.margin.top + self.margin.bottom)
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
    //var colors = ["Uncategorized", "Black", "Blue", "Brown", "Gray", "Green", "More than 1 color", "Orange", "Pink", "Purple", "Red", "White", "Yellow"];
    // var ordinalScale = d3.scaleOrdinal()
    //   .domain(colors)
    //   .range([0, self.svgWidth]);

    // var xAxis = svgGroup.append('g')
    //     .attr("class", "x_axis");
        

    // var xRects = d3.select('.x_axis').selectAll("rect")
    //     .data(colors);

    // var spacing = 100; 

    // xRects.enter().append("rect")
    //     //Matches bars
    //     .attr("x", function(d, index) { 


    //         return (index * spacing);
    //          })
    //     .attr("y", 785)
    //     .attr("height", 18)
    //     .attr("width", 100)
    //     .attr("fill", 'black')
    //     .style("stroke", function(d){

    //         if (d == "Black"){
    //             return "white"
    //         }
    //         else {
    //             return "black";
    //         }
    //     })
    //     .style("stroke-width", "0.5")
    //     .style("shape-rendering", "crispEdges")
    //     .attr("fill", 
    //         function(d){
    //         if (d == "Uncategorized"){
    //             return "white"
    //         }
    //         if (d == "More than 1 color"){
    //             return "white"
    //         }
    //         return d;
    //     });

    // var xLabels = xAxis.selectAll("text")
    //     .data(colors);

    // xLabels.enter().append('text')
    //     .attr("x", function(d, index) { 

    //         return (index * spacing);
    //          })
    //     .attr("y", 830)
    //     .style("fill", "black")
    //     .text(function(d){ return d})
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

    var imageObjects = self.initializeData();
    //console.log(imageObjects);

	// Currently no data wrangling/filtering needed
	// vis.displayData = vis.data;

	//Wrangle Data
	//console.log("gets here");
 //    var city = selected_city; 
	// var selectedCity = this.data[selected_city];
	// //console.log(selectedCity);

	// var imageObjects = [];
	// var color_set = new Set();

	// //We want a tiled bar chart that can sort by color and image
	// selectedCity.forEach(function (d,i){
	// 	d.color = d[14];
	// 	d.url = d[1];

	// 	instagramImage = {
	// 		city: city,
	// 		color: d.color,
	// 		url: d.url

	// 	}

	// 	color_set.add(d.color);
	// 	imageObjects.push(instagramImage);
 //        //console.log(imageObjects);

	// });

	// //console.log(color_set);
	
 //    imageObjects.sort(function(a, b) {
 //        if(a.color < b.color){
 //            return -1;
 //        }else if(a.color > b.color){
 //            return 1;
 //        }else{
 //            return 0;   
 //        }
 //    });

    //console.log(imageObjects);

    _.groupBy(imageObjects, "color");
    //console.log(imageObjects);
    var sortedColorObject = self.groupByTwo(imageObjects, "color")

    //console.log(sortedColorObject);

    // var tilesPerRow = 5;
    // var tileSize = 15;
    // var barPadding = 30;
    // var barWidth = (tilesPerRow * tileSize) + barPadding;
    
    var xAxisPadding = 50;

    var index = 0;

    var AJUST_WIDTH_VIHAR = 900;

    for (var color in sortedColorObject){
    // sortedColorObject.forEach(function(color, i){
        // console.log(sortedColorObject[color].length);

        var x = index*(AJUST_WIDTH_VIHAR/(Object.keys(sortedColorObject).length) + self.barPadding);
        console.log(x);

        var y = self.svgPaddedHeight - xAxisPadding; 

        //console.log(color);

        for(var i = 0; i< sortedColorObject[color].length; i++){
            var rowNumber = Math.floor(i / self.tilesPerRow);
            sortedColorObject[color][i].x = x + (i % self.tilesPerRow) * self.tileSize;
            sortedColorObject[color][i].y = y + (-(rowNumber + 1) * self.tileSize); 
        }
        index = index + 1;
        // colorsArray.push(getTiles(sortedColorObject[color].length));
    }

    var arr = [];

    for (var key in sortedColorObject) {
        if (sortedColorObject.hasOwnProperty(key)) {
            arr.push(  sortedColorObject[key] );
        }
    }

    var merged = [].concat.apply([], arr);

    //console.log(merged);

	//self.updateVis(sortedColorObject);
    self.updateVis(merged, sortedColorObject);

}

//Helper function to filter data
ColorMap.prototype.initializeData = function() {
    var self = this;
    var city = selected_city; 
    var selectedCity = this.data[selected_city];
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
    
    imageObjects.sort(function(a, b) {
        if(a.color < b.color){
            return -1;
        }else if(a.color > b.color){
            return 1;
        }else{
            return 0;   
        }
    });

    //return imageObjects; 

    //console.log(imageObjects);
    return imageObjects;

}

//Helper Function for breaking down objects by color
//Source: https://stackoverflow.com/questions/14696326/break-array-of-objects-into-separate-arrays-based-on-a-property
// function groupBy2(xs, prop) {
//   var grouped = {};
//   // var grouped = [];
//   for (var i=0; i<xs.length; i++) {
//     var p = xs[i][prop];
//     if (!grouped[p]) { grouped[p] = []; }
//     grouped[p].push(xs[i]);
//     // grouped[p].append(xs[i]); 
//   }
//   return grouped;
// }

ColorMap.prototype.groupByTwo = function(xs, prop) {
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

ColorMap.prototype.updateVis = function(merged, sortedColorObject) {
    //var self = this;

	//console.log("here");
    //console.log(sortedColorObject["Black"].length);
    //console.log(Object.keys(merged).length);



    // var sortedColorArray = Object.keys(sortedColorObject)
    // sortedColorArray = Object.keys(sortedColorObject).map(i => sortedColorObject[i])
    var sortedColorArray = Object.entries(sortedColorObject).map(([key, value]) => ([key, value]));
    
    // sortedColorArray = Object.size(merged);

   // for (var color in merged) {
   //    if (merged.hasOwnProperty(color)) {
   //      sortedColorArray.push(color);
   //    }
   //  }

   

    //append x and y key-values to each image in the data set
    //draw tiles based on that data;


    //sortedColorObject['x'].push(colorsArray[]);

    //console.log(sortedColorArray[3][1][1].color);

    //console.log(sortedColorObject); 
    // var tilesPerRow = 5;
    // // var tileSize = 15;
    // var barPadding = 20;
    // var maxValue = 250;

    //var barWidth = (tilesPerRow * tileSize) + barPadding;

  this.data = sortedColorArray;

  var colorGroups = d3.select('.bars')
        .selectAll('g')
        .data(this.data);

  colorGroups.enter()
    .append("g")
    .merge(colorGroups)
    .attr("id", function(d, i) {
        console.log(d[0]);
      if (d[0] == ""){
        return "uncategorized-group"
      }
      return d[0].toLowerCase() + "-group";
    })
    .each(this.colorBarCreator)
    .each(this.updateXAxis);
    // .each(updateLabel);

  colorGroups.exit().remove();

  //updateYAxis();

  //self.updateYAxis();

  //console.log(colorGroups);


  // var img_id = function(d, i){ return "img_" + i; }
  // var img_url = function(d,i){ return "url(#img_" + i + ")"; }
  //var img_url = function(d){ return "url(https://s3.amazonaws.com/streetstyle27k" + d.url + ")"; }

  // var imagePatterns = self.defs.selectAll('pattern')
  //           .data(merged) 
  //           .enter()
  //           .append("pattern")
  //           .attr("id", img_id)
  //           .attr("width", 15)
  //           .attr("height", 15)
  //           .attr("patternUnits", "objectBoundingBox")
  //       .append("image")
  //           .attr("x", function(d, i) {
  //             return 0;
  //           })
  //           .attr("y", function(d) {
  //             return 0;
  //           })
  //           .attr("width", tileSize)
  //           .attr("height", tileSize)
  //           .attr("xlink:href", function(d) {
  //             var path = d.url;
  //             //console.log(path)
  //             var img = "https://s3.amazonaws.com/streetstyle27k" + path;
  //             return img;
  //           });


  //console.log(colorBar);

    
        //self.colorBarCreator();



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


ColorMap.prototype.colorBarCreator = function(d, i) {
    //var self = this;
    //var colorBar = d3.select("g.bars");

      // var tooltip = d3.select("#color-map").append("div")
      //   .attr("class", "tooltip")
      //   .style("opacity", .5);



      //console.log(tileSize)

    var colorBar = d3.select(this)
        // .attr("transform", "translate(" + i * self.barWidth + ", 300)")
        .selectAll('rect')
        .data(d[1]);

    //console.log(d[1]);
    //console.log(tileSize);

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
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", 
                function(d){
                if (d.color == ""){
                    return "white"
                }
                if (d.color == "More than 1 color"){
                    return "white"
                }
                return d.color;
            }
            )
            .style("opacity", 1);

    colorBar.append()

            // colorBar.exit()
            //     // .transition()
            //     // .delay(function(d, i) {
            //     //   return (100 - i) * 20;
            //     // })
            //     .style("opacity", 0)
            //     .on("end", function() {
            //       d3.select(this).remove();
            // });
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




    
          // //Y Axis Code
          // //var chartWidth = (14*tilesPerRow*tileSize+barPadding);
          // var chartWidth = self.svgWidth - 100;
          // var chartHeight = self.svgPaddedHeight - 50;
          // //var chartHeight = (maxValue / tilesPerRow) * tileSize;
          // var maxValue = 300;
          // console.log(chartWidth, chartHeight, maxValue);

          // var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
          // var yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

          // console.log(yAxis);

          // d3.select(".y_axis")
          //   .call(yAxis);

}

// ColorMap.prototype.updateYAxis = function() {
//           //Y Axis Code
//           //var chartWidth = (14*tilesPerRow*tileSize+barPadding);
//           // var chartWidth = self.svgWidth - 100;
//           // var chartHeight = self.svgPaddedHeight - 50;
//           // //var chartHeight = (maxValue / tilesPerRow) * tileSize;
//           // var maxValue = 300;
//           console.log(self.svgHeight);

//           // var yScale = d3.scaleLinear().domain([0, maxValue]).range([chartHeight, 0]);
//           // var yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

//           // console.log(yAxis);

//           // d3.select(".y_axis")
//           //   .call(yAxis);
//           return 0; 
// }


ColorMap.prototype.updateXAxis = function(d) { 

var buffer = 10;
//console.log(d[0]);
  var el = d3.select(this)
    .select("circle");

  if(el.empty()) {
    el = d3.select(this)
      .append("circle")
      .attr("cy", 800)
      .attr("cx", function(d,i){ return (d[1][0]['x'] + buffer);})
      .attr("r", 10)
      // .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("fill", function(d,i){

        if(d[0] == ""){ return "white"}
        else if(d[0] == "Uncategorized") { return "white"}
        else if(d[0] == "More than 1 color"){ return "white"};

        return d[0];})
        .style("stroke", function(d){
                if (d[0] == "Black"){
                    return "white"
                }
                else {
                    return "black";
                }
            })
        .style("stroke-width", "0.5"); 
  }

  //el.text(d[0]);
}

//Helper function for data visualization creation.
//Modified from Source: https://flowingdata.com/2018/09/20/tiled-bar-chart-d3-js/
ColorMap.prototype.getTiles = function(num) {
  var tiles = [];
  //var tilesPerRow = 5;
  var tileSize = 15;



   
  for(var i = 0; i < num; i++) {
    var rowNumber = Math.floor(i / self.tilesPerRow);

    // tiles.push({
    //   x: (i % tilesPerRow) * tileSize,
    //   y: -(rowNumber + 1) * tileSize
    // });
  }
   
  return tiles
}


