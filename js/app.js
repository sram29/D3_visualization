// D3 Scatterplot Assignment

var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.csv("data/data.csv", function(err, populationData) {
    if (err) {
        throw err;
    }

    populationData.forEach(function(data) {
        data.Male_population = +data.Male_population;
        data.Female_population = +data.Female_population;
    });


    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    xLinearScale.domain([20, d3.max(populationData, function(data) {
        return +data.Male_population;
    })]);
    yLinearScale.domain([0, d3.max(populationData, function(data) {
        return +data.Female_population * 1.2;
    })]);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var State = data.Geography;
            var MalePopulation = +data.Male_population;
            var FemalePopulation = +data.Female_population;
            return (State + "<br> Male Population: " + MalePopulation + "<br> Female Population: " + FemalePopulation);
        });

    chart.call(toolTip);

    chart.selectAll("circle")
        .data(populationData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.Male_population);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.Female_population);
        })
        .attr("r", "10")
        .attr("fill", "tomato")
        .on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Female Population per state in 2014");

    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("Male Population per state in 2014");
});


