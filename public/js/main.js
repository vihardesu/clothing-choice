/*
 * Root file that handles instances of all the charts and loads the visualization
 */

var b;

(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creating instances for each visualization


        d3.queue()
	        .defer(d3.json,"raw_data/city_info.json")
          .defer(d3.csv,"data/fashion_companies.csv")
	         .await(createVis);

        function createVis(error, city_info, fashion_companies){

              city_data = city_info[selected_city];

              var data = city_info;


              var overviewChart = new OverviewChart();

              overviewChart.update(fashion_companies);

              //value is the month, and the number is the amount of times it gets printed
              b = new Beeswarm(city_info);

              var g = new Globe(city_info);

              var colorMap = new ColorMap(city_info);


       }

    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();
