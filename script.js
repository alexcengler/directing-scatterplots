

d3.queue()
  .defer(d3.json, 'data/fam-w-children-tanf-ratio.json')
  .awaitAll(function (error, results) {
    if (error) { throw error; }

    line1 = new LineChart(results[0], "#lineChart1", "tanf_fam", "Families on TANF",0,7500000)
    line2 = new LineChart(results[0], "#lineChart2", "fam_child_pov", "Families in Poverty",0,7500000)

    d3.select('#stage1').on('click', function () {
        line1.stage1();
        line2.stage1();
        textStage1();
    });

    d3.select('#stage2').on('click', function () {
        line1.stage2();
        line2.stage2();
        textStage2();
    });


  });


var margin = {
	left: 80,
	right: 50,
	top: 50,
	bottom: 50
};


var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;


function LineChart(data, divID, yvar, title, ymin, ymax){
    var chart = this;

    chart.yvar = yvar;
    chart.data = data;
    chart.title = title;

    chart.SVG = d3.select(divID)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    chart.svg = chart.SVG
        .append("g")
        .attr("transform", function(){ return "translate(" + margin.left + "," + margin.top + ")" });

   chart.xScale = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year }  ) )
        .range([0, width])
        .nice();

    chart.yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0]);

    chart.xAxis = d3.axisBottom(chart.xScale).ticks(10).tickFormat(d3.format(".0f"));
    chart.yAxis = d3.axisLeft(chart.yScale).ticks(5, "s");

};


LineChart.prototype.stage1 = function() {
    var chart = this;

    data = chart.data.slice();

    chart.svg.selectAll(".stage1").remove();
    chart.svg.selectAll(".stage2").remove();

    chart.svg.append("g")
        .attr("transform", function(){ return "translate(0," + height + ")" })
        .attr("class", "axis")
        .call(chart.xAxis)
        .attr("opacity",0)
        .transition().duration(500)
        .attr("opacity",1);

    chart.svg.append("g")
        .attr("class", "axis")
        .call(chart.yAxis)
        .attr("opacity",0)
        .transition().duration(500)
        .attr("opacity",1);

    chart.svg
        .append("text")
        .attr("class", "xAxisLabel")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom * 0.75)
        .style("text-anchor", "middle")
        .html("Year");

    chart.svg
        .append("text")
        .attr("class", "yAxisLabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -(margin.left * 0.6))
        .style("text-anchor", "middle")
        .html(chart.title);

    chart.svg.selectAll(".circ")
        .data(data, function(d){ return d.year }).enter()
        .append("circle")
        .attr("class", "circ stage1")
        .attr("cx", function(d){ return chart.xScale(d.year) })
        .attr("cy", function(d){ return chart.yScale(d[chart.yvar]) })
        .attr("r", 0)
        .transition()
        .delay(function(d,i) { return 200 + (i * 50) })
        .attr("r", 5)

    var line = d3.line()
        .x(function(d) { return chart.xScale(d.year); })
        .y(function(d) { return chart.yScale(d[chart.yvar]); });

    chart.svg.append("path")
        //.datum(data)
        .attr("class", "line stage1")
        .transition().duration(1700)
        .attrTween('d', function() {

            var lineInterpolate = d3.scaleQuantile()
                .domain([0,1])
                .range(d3.range(1, data.length + 1));   

            return function(t) {
                return line(data.slice(0, lineInterpolate(t)));
            };
        })



};

LineChart.prototype.stage2 = function() {
    
    var chart = this;
    var data = chart.data;

    chart.svg.selectAll(".stage2").remove();

    chart.svg.selectAll(".vline")
        .data(data, function(d){ return d.year }).enter()
        .append("line")
        .attr("class", "vline stage2")
        .transition().delay(1000)
        .attr("x1", function(d) { return chart.xScale(d.year); })
        .attr("x2", function(d) { return chart.xScale(d.year); })
        .attr("y1", function(d) { return chart.yScale(d[chart.yvar]); })
        .attr("y2", function(d) { return height })

};





var textStage1 = function(){

    d3.select("#narrative").html("")
    d3.select("#narrative")
        .append("h4")
        .html("Let's start with with two normal lines charts...")
}

var textStage2 = function(){

    d3.select("#narrative").html("")
    d3.select("#narrative")
        .append("h4")
        .html("And now something esle")
}


