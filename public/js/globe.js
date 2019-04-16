/*create globe object
 *  Globe - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

//global variable
var selected_city = "Los Angeles";

Globe = function(_data) {

	this.data = _data;
	this.initVis();
}

/*
 *  Initialize globe elements
 */

Globe.prototype.initVis = function() {
	var vis = this;
	//set up city list

	var counter = 0;
	const keys = Object.keys(vis.data)
		for (const key of keys) {
			//I did this to avoid having one long city list
			if(counter>17){
				$('#city-list2').append(
					$('<p>'+ key + '</p>' ).attr('class', 'city')
						);
			}
			else{

			$('#city-list1').append(
		    $('<p>'+ key + '</p>' )
				.attr('class', 'city')
					);
				}
				counter = counter + 1;
	}



  vis.width = 500;
  vis.height = 500;
  vis.sens = .25;
  vis.focused;

  vis.margin = {top: 150, right: 20, bottom: 30, left: 200};

  vis.svg = d3.select("#chart1").append("svg")
      .attr("width", vis.width)
      .attr("height", vis.height);

      //Setting projection

  vis.projection = d3.geoOrthographic()
      .scale(245)
      .rotate([0, 0])
      .translate([vis.width / 2, vis.height / 2])
      .clipAngle(90);

  // vis.path = d3.geoPath(vis.projection);
	vis.geoPath = d3.geoPath().projection(vis.projection);

	// vis.tooltip = d3.select("body").append("div")
	// 	.attr("class", "city-tooltip")
	// 	.style("visibility", "hidden")

	vis.cities = d3.selectAll(".city")
	.data(keys);

	vis.cities.exit().remove();

	var past_el;

	vis.cities.on("mouseover", function(d) {
		console.log(d);
			// tooltip.transition()
			// 	.duration(200)
				// .style("opacity", .9)
				// vis.tooltip.style("visibility", "visible");
				d3.select(this)
				// .enter()
				.style("font-weight", "700");
			// 	.style("background", "white")
			// 	.style("border-radius", "2px");
			// vis.tooltip.html(d)
			// 	.style("left", (d3.event.pageX + 5) + "px")
			// 	.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			d3.select(this)
			.style("font-weight", "normal");
		})
		.on("click", function(d) {
			selected_city = d;

			if(past_el) {
				//reset the previous element
				past_el
					.style("font-size", "18px")
					.style('background', 'none')

					$('#cityname').html("Currently Selected City: "+d);

				// for the new element
				past_el = d3.select(this)
				.style("font-size", "28px")
				.style('background', 'yellow')
				b.updateVis();
				return;
			}
			$('#cityname').html("Currently Selected City: "+d);
			past_el = d3.select(this)
			.style("font-size", "34px")
			.style('background', 'yellow')

			b.updateVis();

		})

  // Update the visualization
	vis.updateVis();
}


/*
 *  The drawing function
 */

Globe.prototype.updateVis = function() {
	var vis = this;

  //Adding water
  vis.svg.append("path")
  .datum({type: "Sphere"})
  .attr("class", "water")
  .attr("d", vis.geoPath);

	var cityTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      // .html(d => `${d.name}: ${commaFormat(d.population)}`);
			.html(d => console.log(d));
  vis.svg.call(cityTip);

  // var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");

	// d3.queue()
	// 	.defer(d3.json,"raw_data/city_info.json")
	// 	.defer(d3.csv,"data/fashion_companies.csv")
	// 	 .await(createVis);

  d3.queue()
  .defer(d3.json, "raw_data/world-110.json")
  .defer(d3.json, "raw_data/city-loc.json")
  .defer(d3.tsv, "raw_data/world-countries.tsv")
  .await(ready);

  //Main function

  function ready(error, world, cities, countryData) {

    // var countryById = {},
    countries = topojson.feature(world, world.objects.countries).features;

    // console.log(cities);

    var result = [];
		const citiesG = vis.svg.append('g');

    for(var i in cities)
      result.push([i, cities [i]]);

    result.forEach((d => {
            d[1].lat = +d[1].lat;
            d[1].lon = +d[1].lon;
            d[1].pop= +d[1].pop;
          }));

		//Drawing countries on the globe
			var world = vis.svg.selectAll("path.land")
			    .data(countries)
			    .enter().append("path")
			    .attr("class", "land")
			    .attr("d", vis.geoPath);

		const draw = () => {

			const point = {
            type: 'Point',
            coordinates: [0, 0]
          };

          result.forEach(d => {
            point.coordinates[0] = d[1].lon;
            point.coordinates[1] = d[1].lat;
            d.projected = vis.geoPath(point) ? vis.projection(point.coordinates) : null;
          });


					const circles = citiesG.selectAll('circle')
		            .data(result.filter(d => d.projected));
		          circles.enter().append('circle')
		            .merge(circles)
		              .attr('cx', d => d.projected[0])
		              .attr('cy', d => d.projected[1])
		              .attr('fill', 'red')
		              .attr('fill-opacity', .65)
		              .attr('r', 6)
		              .on('mouseover', cityTip.show)
		              .on('mouseout', cityTip.hide);
		          circles.exit().remove();
		};

		draw();
    //Define what to do when dragging
    var dragging = function(d) {


      /* TO-DO: FIND A WAY TO MOVE CITIES ALONGSIDE AND ON TOP OF COUNTRIES */
      var rotate = vis.projection.rotate();
        vis.projection.rotate([d3.event.x * vis.sens, -d3.event.y * vis.sens, rotate[2]]);

        vis.svg.selectAll("path.land").attr("d", vis.geoPath);
				draw();

      }

    var drag = d3.drag()
      //instead of origin, used subject instead for v4
      .subject(function() {
          var r = vis.projection.rotate();
          return {x: r[0] / vis.sens, y: -r[1] / vis.sens};
        })
        .on("drag", dragging);


    //Create a container in which all pan-able elements will live
    var map = vis.svg.append("g")
             .attr("id", "map")
             .call(drag);  //Bind the dragging behavior

    //D3 trick from the book: create a new, invisible background rect to catch drag events
    map.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", vis.width)
      .attr("height", vis.height)
      .attr("opacity", 0);

    //Mouse events
    // world
    // .on("mouseover", function(d) {
    //   countryTooltip.text(countryById[d.id])
    //   .style("left", (d3.event.pageX + 7) + "px")
    //   .style("top", (d3.event.pageY - 15) + "px")
    //   .style("display", "block")
    //   .style("opacity", 1);
    // })
    // .on("mouseout", function(d) {
    //   countryTooltip.style("opacity", 0)
    //   .style("display", "none");
    // })
    // .on("mousemove", function(d) {
    //   countryTooltip.style("left", (d3.event.pageX + 7) + "px")
    //   .style("top", (d3.event.pageY - 15) + "px");
    // });

    //Country focus on option select
    // d3.select("select").on("change", function() {
    //   var rotate = projection.rotate(),
    //   focusedCountry = country(countries, this),
    //   p = d3.geo.centroid(focusedCountry);
    //
    //   svg.selectAll(".focused").classed("focused", focused = false);
    //
    // //Globe rotating
    //
    // (function transition() {
    //   d3.transition()
    //   .duration(2500)
    //   .tween("rotate", function() {
    //     var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
    //     return function(t) {
    //       projection.rotate(r(t));
    //       svg.selectAll("path").attr("d", path)
    //       .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
    //     };
    //   })
    //   })();
    // });

  };


}
