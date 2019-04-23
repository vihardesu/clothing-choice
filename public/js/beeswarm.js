/*create globe object
 *  Globe - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */


Beeswarm = function(_data) {

	this.data = _data;

  this.months = ['2013_7', '2013_8', '2013_9','2013_10', '2013_11', '2013_12',
  '2014_1','2014_2', '2014_3', '2014_4', '2014_5', '2014_6',
  '2014_7', '2014_8', '2014_9', '2014_10', '2014_11', '2014_12',
  '2015_1', '2015_2', '2015_3', '2015_4', '2015_5', '2015_6', '2015_7', '2015_8',
  '2015_9', '2015_10', '2015_11', '2015_12']

  // '2013_6':0,

  this.months_dict = {'2013_7':1, '2013_8':2, '2013_9':3,'2013_10':4, '2013_11':5, '2013_12':6,
  '2014_1':7,'2014_2':8, '2014_3':9, '2014_4':10, '2014_5':11, '2014_6':12,
  '2014_7':13, '2014_8':14, '2014_9':15, '2014_10':16, '2014_11':17, '2014_12':18,
  '2015_1':19, '2015_2':20, '2015_3':21, '2015_4':22, '2015_5':23, '2015_6':24, '2015_7':25, '2015_8':26,
  '2015_9':27, '2015_10':28, '2015_11':29, '2015_12':30}

  // this.category_dict = {'Shirt': }

  this.dict = {'major_color' : ['Black', 'White', 'More than 1 color', 'Blue', 'Gray', 'Red', 'Pink', 'Green',
                     'Yellow', 'Brown', 'Purple', 'Orange', 'Cyan', 'Uncategorized'],
    'clothing_category' : ['Shirt', 'Outerwear', 'T-shirt', 'Dress', 'Tank top', 'Suit', 'Sweater', ''],
    'clothing_pattern': ['Solid','Graphics','Striped','Floral','Plaid','Spotted']
  }

	this.initVis();

}

/*
 *  Initialize matrix svg
 */

Beeswarm.prototype.initVis = function() {
	var vis = this;

  //padding for the visualization
  vis.margin = {top: 140, right: 50, bottom: 30, left: 190};

  // vis.width = 1000 - vis.margin.left - vis.margin.right;
  // vis.height = 1000 - vis.margin.top - vis.margin.bottom;
  vis.width = 1500;
  vis.height = 1000;

  vis.svg = d3.select("#chart2").append("svg")
      .attr("width", vis.width)
      .attr("height", vis.height)
      .append("g")
      .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top +")");

  vis.x = d3.scalePoint()
      .domain(vis.months)
      .range([0, vis.width-vis.margin.left-vis.margin.right])
      .padding(1.0);

  vis.xLin = d3.scaleLinear()
    .domain([1, 30]) //number of months available
    .range([0, vis.width-vis.margin.left-vis.margin.right]);

  vis.y = d3.scalePoint()
        .domain(vis.dict.clothing_category)
        .range([0, vis.height-vis.margin.top])
        .padding(1.0);
  // Axes
  vis.xAxis =
    d3.axisTop(vis.x)
      .tickFormat(function(d) {
        var year = d.substring(0, 4)
        var month = d.substring(5)
        // console.log(month);
        return month;
      })
      .tickSize(vis.height+20);

  // vis.xAxis = d3.axisTop(vis.xLin)
  // .tickFormat(function(d) {
  //       return d;
  //     })
  // .tickSize(vis.height+20);

  vis.yAxis = d3.axisLeft(vis.y)
      .tickSize(10)
      .tickFormat(function(d) {
        // console.log(d);
          if(d == ""){
            return "Uncategorized";
          }
          return "" +d;
      });

      var column_names = vis.months;

      // X axis
        vis.svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + (vis.height) + ")")
            .call(vis.xAxis)
						.selectAll("text")
        // .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        // .attr("transform", "rotate(-10)");
        // x axis bottom
        vis.xAxis.tickSize(20);
				console.log("herebee");
				// now rotate text on x axis

        // Y axis
        vis.svg.append("g")
          .attr("class", "y axis")
					.style("font-size", "22px")
          .call(vis.yAxis)


  // so here's my idea, the beeswarm can only encode 1-d data, so in order to encode
  // both the date and clothing category, I'm going to create a new axis for every date ->
  // and I should split it up into 3 month chunks, rather than have so many data points for each
  // month, so I'll show Jan-March, April-Jun, July-Sept, Oct-Dec, and I'll run the swarm multiple
  // times for each data point. So the question is, do I need multiple x axes, or multiple y axes?
  // No, I need multiple x axes, because I need to encode the time data to place in a bucket
  // I can keep the x-axis constant (depending on clothing_category), and change the y-placement
  // into time buckets

  //merge all swarms afterwards


    vis.updateVis();

}


/*
*  The drawing function
*/

Beeswarm.prototype.updateVis = function() {
  var vis = this;

  var city = vis.data[selected_city];

  var arr = vis.data[selected_city]

  var color_selected = 0;

  if(color_selected == 1){

  };

  var tooltip = d3.select("#chart2").append("div")
  .attr("class", "node-tip")
  .style("opacity", 0);

    //now the x value is the value of the month, and the y value is the placement of the clothing
    // category or clothing pattern

    var simulation = d3.forceSimulation(city)
      						.force("x", d3.forceX(function(d, i) {
                    var month = vis.months_dict[d[4]]

                    return vis.xLin(month);
                  }).strength(1.0))
      				    .force("y", d3.forceY(function(d) {
                      var category = d[20]
                      return vis.y(category);}))
      				    	.force("collide", d3.forceCollide(5))
      				    	.stop();

      for (var i = 0; i < (city).length; ++i) simulation.tick();

      var nodes =
          vis.svg.selectAll(".nodes")
						.data(city, function(d) { return d});

					// countriesCircles.exit()
          nodes.exit()
						.transition()
				    	.duration(1000)
				    	.attr("cx", vis.margin.left)
						  .attr("cy",
              function(d, i) {
                var category = d[20]
                return vis.y(category);
              })
						.remove();

            nodes.enter()
						.append("circle")
						.attr("class", "nodes")
            .on("mouseover", function (d) {
              d3.select(this).attr("r", 7);
                tooltip.transition()
                .duration(200)
                .style("opacity", .9);
              var path = d[1];
							console.log(d[4])
              var string = "<img src=https://s3.amazonaws.com/streetstyle27k" + path +" />";
               tooltip.html(string)
                .style("left", d3.select(this).attr("cx") + "px")
                .style("top", d3.select(this).attr("cy") + "px");
              })
              .on("mouseout", function (d) {
                d3.select(this).attr("r", 5);
                  tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
              })
						.attr("cx", vis.margin.left)
						.attr("cy", function(d, i) {
            // console.log(d);
            var category = d[20]
            return vis.y(category);
            })
            // (h / 2)-padding[2]/2)
						.attr("r", 5)

            .attr("fill", function(d){
              var color = d[14];
              if(color == ""){
                return "white";
              }
              if(color == "More than 1 color"){
                return "black";
              }
              return color;})
              .attr("stroke", function(d){
                var color = d[14];
                if(color == "White"){
                  return "black";
                  }
                if(color == ""){
                  return "silver";
                  }
                if(color == "More than 1 color"){
                    return "red";
                  }
                })
              .attr("stroke-width", function(d){
                var color = d[14];
                if(color == "White"){
                  return 1.0;
                }
                if(color == ""){
                  return 1.0;
                }
                if(color == "More than 1 color"){
                  return 1.0;
                }
                })
            .merge(nodes)
						.transition()
				    	.duration(2000)
				    	.attr("cx", function(d) { return d.x; })
				    	.attr("cy", function(d) { return d.y; });

    }
