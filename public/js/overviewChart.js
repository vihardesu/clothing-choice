
/**
 * Constructor for the Overview Chart

 */
function OverviewChart(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
OverviewChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 30, bottom: 30, left: 30};

    //Gets access to the div element created for this chart from HTML
    var divOverviewChart = d3.select("#overview-chart").classed("content", true);
    self.svgBounds = divOverviewChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 650;

    //creates svg element within the div
    self.svg = divOverviewChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
        .attr("id", "overview-chart-svg")

    self.svg.append("g")
        .attr('width', self.svgWidth)
        .attr('height', self.svgHeight)
        .attr('id', "overview-chart-group");

    var divLegendChart = d3.select("#legend-overview-chart");

    var legendGroup = divLegendChart.append("g")
        .attr("class", "legend")
        .attr('width', self.svgWidth)
        .attr('height', self.svgHeight)
        .attr("transform", "translate(" + 87 + "," + -20 + ")");

    legendGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .style('font-weight', "bold")
        .text("Clothing Industry Sector")

    var ledgColors = ['#ffffff', '#ffffff', '#00CCC6', '#FF4646', '#99CC00', '#CC33FF',
            '#6633FF', '#CCFF33', '#1BC444', '#3333CC', '#FF9900', '#339933',
            '#1BAAC4', '#CD0EB9', '#9966FF', '#990033', '#E735D7', '#00CC99',
            '#FF6B6B', '#99CC00', '#1f65a8', '#e5ddb1', '#ee41e4', '#c4e628',
            '#7B68EE', '#D4AF37', '#fff0f5']

    ,   ledgLabels = ["", "", "Clothing","Specialty Retail","Footwear","Recreational Goods","Other Commercial Services","Holding Companies","Internet Retail","Department Stores","Catalog Retail","Logistics", "Other Retail", "Accessories", "Luxury Goods", "Distributors/Wholesale", "Consulting Services (B2B)", "Aerospace and Defense", "Conglomerates", "Buildings and Property", "Distributors/Wholesale (B2C)", "Other Apparel", "Industrial Supplies and Parts", "Other Textiles", "General Merchandise Stores", "Other Restaurants, Hotels and Leisure"]
        for (i = 0; i < 24; i++) {
            legendGroup.append('div')
                .attr("class","legend")
                .style("width", "350px")
                .style("height", "15px")
                .style("top", function (d) { return (55 + 18*i) + "px" })
                .text(function (d) { return ledgLabels[i] })
                .style("background", function (d) { return ledgColors[i] })
        };

};


//Creates Chart
OverviewChart.prototype.update = function(fashionCompanies){
    var self = this;
    //console.log(self.fashionCompanies);

    //Create Company Object
    var companies = [];

    var industry_category_list = new Set();
    //var industry_group_list = new Set();
    //var hq_country_list = new Set();
    companies.push(company = {
        name: "Fashion",
        primary_industry: "",
        revenue: 0
    });

    fashionCompanies.forEach(function (d) {
        d.Company_Name = d['Company Name'];
        d.Primary_Industry = d['Primary Industry Code']
        d.All_Industries = d['All Industries'].split(',')
        d.Primary_Industry_Group = d['Primary Industry Group']
        d.HQ_City = d['HQ City']
        d.HQ_Country = d['HQ Country']
        d.Revenue = parseFloat(d['Revenue'].replace(/,/g, ''))
        d.Market_Cap = parseFloat(d['Market Cap'].replace(/,/g, ''))

        //Create Company Object
        company = {
            name: d.Company_Name,
            //industry_list: d.All_Industries,
            primary_industry: d.Primary_Industry,
            // location: d.HQ_Country,
            revenue: d.Revenue
            // market_cap: d.Market_Cap
        }




        //Create Sets of Selectable Categories
        industry_category_list.add(d.Primary_Industry);
        // industry_group_list.add(d.Primary_Industry_Group);
        // hq_country_list.add(d.HQ_Country);
        companies.push(company);


    });

    //console.log(companies);
    for (var it = industry_category_list.values(), val= null; val=it.next().value; ) {
        companies.push({
                name: val,
                //industry_list: "",
                primary_industry: "Fashion",
                //location: "",
                revenue: 0
                //market_cap: 0
        });

    var ordinalScale = d3.scaleOrdinal()
        .domain(industry_category_list)
        .range(['#ffffff', '#ffffff', '#00CCC6', '#FF4646', '#99CC00', '#CC33FF',
            '#6633FF', '#CCFF33', '#1BC444', '#3333CC', '#FF9900', '#339933',
            '#1BAAC4', '#CD0EB9', '#9966FF', '#990033', '#E735D7', '#00CC99',
            '#FF6B6B', '#99CC00', '#1f65a8', '#e5ddb1', '#ee41e4', '#c4e628',
            '#7B68EE', '#D4AF37', '#fff0f5']);
    }

    //console.log(industry_category_list);
    //console.log(ordinalScale);


    //console.log(companies);

    //Stratify Data
    var rootNode = d3.stratify()
        .id(function(d) { return d.name; })
        .parentId(function(d) {  return d.primary_industry; })
        (companies);

    //console.log(rootNode);

    drawViz(rootNode)

    function drawViz(rootNode) {
        // Declare d3 layout
        var vLayout = d3.treemap()
            .size([self.svgWidth, self.svgHeight])
            .paddingOuter(5);

        // Layout + Data
        var vRoot = d3.hierarchy(rootNode)
            .sum(function (d) { return d.data.revenue; });

        var vNodes = vRoot.descendants();
        vLayout(vRoot);
        var vSlices = d3.select("#overview-chart-group").selectAll('rect')
            .data(vNodes)
            .enter()
            .append('rect');

        // Define the div for the tooltip
        var tip = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", .9);


        //if previously clicked
        var clicked = []

        console.log("here")

        // Draw on screen
        vSlices.attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('stroke', 'white')
            .attr('stroke-width', '.5px')
            .attr('fill', function (d, i) {
                // console.log(d.data.data.primary_industry); 
                //console.log(d.data.primary_industry);
                if (d.data.data.primary_industry == null){
                    return "black";
                }
                else {
                    return ordinalScale(d.data.data.primary_industry);
                }

                //return ordinalScale(d.data.data.primary_industry);
            })
            .on("mouseover", function (d) {   

                tip.html(d.data.data.name + "<br/>" + "Industry: " + d.data.data.primary_industry + "<br/>" + "Revenue: " + d.data.data.revenue)  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("display", "inline-block");

            }) 
            .on("mouseout", function (d) {
                tip.style("display", "none");  
            })
            .on("click", function (d) {
                console.log("here"); 
                var click = d3.select(this);
                // tip.html(d.data.data.name + "<br/>" + "Industry: " + d.data.data.primary_industry + "<br/>" + "Revenue: " + d.data.data.revenue)  
                //     .style("left", (d3.event.pageX) + "px")     
                //     .style("top", (d3.event.pageY - 28) + "px")
                //     .style("display", "inline-block");
                console.log(click); 
                // tip.style("display", "none");  
            });

    }
};
