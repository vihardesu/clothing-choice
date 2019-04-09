/*create globe object
 *  Globe - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

Globe = function(_data) {

	this.data = _data;
	this.initVis();
}

/*
 *  Initialize matrix svg
 */

Globe.prototype.initVis = function() {
	var vis = this;
  vis.width = 600;
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

  vis.path = d3.geoPath(vis.projection);
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
  .attr("d", vis.path);

  // var countryTooltip = d3.select("body").append("div").attr("class", "countryTooltip");

  queue()
  .defer(d3.json, "../../raw_data/world-110.json")
  .defer(d3.json, "../../raw_data/result.json")
  .defer(d3.tsv, "../../raw_data/world-countries.tsv")
  .await(ready);

  //Main function

  function ready(error, world, cities, countryData) {

    // var countryById = {},
    countries = topojson.feature(world, world.objects.countries).features;

    // console.log(cities);

    var result = [];

    for(var i in cities)
      result.push([i, cities [i]]);

    result.forEach((d => {
            d[1].lat = +d[1].lat;
            d[1].lon = +d[1].lon;
            d[1].pop= +d[1].pop;
            d[1].coord = vis.projection([d[1].lat, d[1].lon]);
          }));

    // add circles to svg
    // vis.svg.selectAll(".cities")
    // .data(function (d, i) {
    //   return result;
    // })
    // .enter()
    // .append("circle")
    // .attr("cx", function (d, i) {
    //   // console.log(d[1].coord[0]);
    //   return d[1].coord[0]; })
    // .attr("cy", function (d) {
    //   return d[1].coord[1]; })
    // .attr("r", "8px")
    // .attr("class", "cities")
    // .attr("fill", "red")

    //Define what to do when dragging
    var dragging = function(d) {

      /* TO-DO: FIND A WAY TO MOVE CITIES ALONGSIDE AND ON TOP OF COUNTRIES */
      var rotate = vis.projection.rotate();
        vis.projection.rotate([d3.event.x * vis.sens, -d3.event.y * vis.sens, rotate[2]]);
        // svg.selectAll(".cities").attr()
        vis.svg.selectAll("path.land").attr("d", vis.path);
        vis.svg.selectAll(".focused").classed("focused", focused = false);
      }


    var drag = d3.drag()
      //instead of origin, used subject instead for v4
      .subject(function() {
          var r = vis.projection.rotate();
          return {x: r[0] / vis.sens, y: -r[1] / vis.sens};
        })
        .on("drag", dragging);

    //Drawing countries on the globe
    var world = vis.svg.selectAll("path.land")
    .data(countries)
    .enter().append("path")
    .attr("class", "land")
    .attr("d", vis.path);

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
    world
    .on("mouseover", function(d) {
      countryTooltip.text(countryById[d.id])
      .style("left", (d3.event.pageX + 7) + "px")
      .style("top", (d3.event.pageY - 15) + "px")
      .style("display", "block")
      .style("opacity", 1);
    })
    .on("mouseout", function(d) {
      countryTooltip.style("opacity", 0)
      .style("display", "none");
    })
    .on("mousemove", function(d) {
      countryTooltip.style("left", (d3.event.pageX + 7) + "px")
      .style("top", (d3.event.pageY - 15) + "px");
    });

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
