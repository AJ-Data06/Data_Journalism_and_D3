// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./data.csv").then(function(acsData) {
  console.log(acsData);
    // Step 1: Parse Data/Cast as numbers
    // ==============================
  acsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  })
    // Step 2: Create scale functions
    // ==============================
  var xScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d.poverty) -2, d3.max(acsData, d => d.poverty) +2])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d.healthcare) -1, d3.max(acsData, d => d.healthcare) +1])
    .range([height, 0]);
    // Step 3: Create axis functions
    // ==============================
  var xAxis = d3.axisBottom(xScale);

  var yAxis = d3.axisLeft(yScale);
    // Step 4: Append Axes to the chart
    // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis)
    // Step 5: Create Circles
    // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "pink")
    .attr("class", "stateCircle")
    .attr("stroke", "black");
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`healthcare ${(d.healthcare)}<hr>poverty rate ${d.poverty}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
    // Create axes labels

    chartGroup.append("text")
	    .attr("class", "stateText")
      .selectAll("tspan")
      .data(acsData)
      .enter()
      .append("tspan")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yScale(d.healthcare))
	    .text(function(d){return d.abbr})


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare%");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("In poverty(%)");
  }).catch(function(error) {
    console.log(error);
  });
