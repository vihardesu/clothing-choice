CityGlobe = function(_data) {
  var self = this;
  this.data = _data;
  this.initVis();
}

CityGlobe.prototype.initVis = function() {
    
    var self = this;

    const keys = Object.keys(self.data); 
    const values = Object.values(self.data); 


    console.log(values[0].length); 


    var cityData = [];

    for (var i = 0; i<31; i++){
      console.log(keys[i], values[i][0][5], values[i][0][6])
      cityData.push([keys[i], values[i][0][5], values[i][0][6],values[i].length ])
      //cityData.push( [keys[i], values[i][0][5], values[i][0][6] ); 
    }; 




  
  self.margin = {top: 50, right: 30, bottom: 50, left: 30};

  //Gets access to the div element created for this chart from HTML
  var divCityGlobeMap = d3.select("#city_globe_chart").classed("content", true);
  self.svgBounds = divCityGlobeMap.node().getBoundingClientRect();
  self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
  self.svgPaddedHeight = 1000;

  // self.axisHeight = 900; 

  //creates svg element within the div
  self.svg = divCityGlobeMap.append("svg")
      .attr("width",self.svgWidth)
      .attr("height",self.svgPaddedHeight + self.margin.top + self.margin.bottom)
      .attr("id", "city-globe-chart-svg")

  var svgWorldGroup = self.svg.append("g")
      .attr('width', self.svgWidth)
      .attr('height', self.svgPaddedHeight)
      .attr('id', "world-chart-group")
      .attr('transform', "translate(" + 20 + "," + 40 + ")");

  var svgCityGroup = self.svg.append("g")
      .attr('width', self.svgWidth)
      .attr('height', self.svgPaddedHeight)
      .attr('id', "city-chart-group")
      .attr('transform', "translate(" + 20 + "," + 40 + ")");



  var width = self.svgWidth; 
  var height = self.svgPaddedHeight;
  self.createVisualization(cityData, width, height);



}

CityGlobe.prototype.createVisualization = function(cityData, width, height) {
  
  //var selectedCity = "";

  console.log(cityData);

    var projection = d3.geoMercator()
      .scale(width / 2 / Math.PI)
      //.scale(100)
      .translate([width / 2, height / 2])

    var path = d3.geoPath()
      .projection(projection);
    
    var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    d3.json(url, function(err, geojson) {
      geojson.features = geojson.features.filter(d => d.id !== "ATA");
      d3.select("#world-chart-group").append("path")
        .attr("d", path(geojson))
    }); 

    // Define the div for the tooltip
    var tip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", .9);

    var cities = d3.select("#city-chart-group").selectAll(".city")
        .data(cityData);

    cities.enter()
    .append("circle")
    .attr("class", ".city")
    .attr("r", 10)
    .attr('stroke', 'white')
    .attr('stroke-width', '.5px')
    .attr("fill", "red")
    .attr("transform", function(d) {
      console.log(d);
      return "translate(" + projection([d[2], d[1]]) + ")";
    })            
    .on("mouseover", function (d) {   


        d3.select(this)
            .attr("fill","grey")
            .attr("stroke-width",2);
      

        return tip.html(d[0] + "<br>" + "Number of Images: " + d[3])  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px")
            .style("display", "inline-block");

    }) 
    .on("mouseout", function (d) {

      d3.select(this)
        .attr("fill", "red")
        .attr('stroke-width', '.5px')    
      
      tip.style("display", "none");  

    })

    .on("click", function (d) {

      selected_city = d[0];

      d3.select(this)
             .attr("fill","grey")
            .attr("stroke-width",2);  

      $(".selectedCityOne").empty()

      d3.select(".selectedCityOne")
        .append('text')
        .text("Current Selected City: " + d[0]) 

       $(".selectedCityTwo").empty()

      d3.select(".selectedCityTwo")
        .append('text')
        .text("Uploaded Images From: " + d[0])      



      //Pass the object name to another visualization.


      c.updateVis();

    }); 
; 



    cities.exit().remove();






}



