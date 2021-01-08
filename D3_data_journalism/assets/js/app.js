var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create an SVG wrapper, append and SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", 'translate(${margin.left}, $${margin.top})');

//Initial Params
var chosenXAxis = "poverty";

//function used for updating x-scale var upon clink on axis lavel
function xScale(data, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
          d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

//function used for updating XAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
//function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
    var label;

    if (chosenXAxis === "poverty") {
        label = "In Poverty (%)";
    }
    else if (chosenXAxis === "age"){
        label = "Age (Median)";
    }
    else if (chosenXAxis === "income"){
        label = "Houshold Income (Median)";
    }
    var toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([80, -60])
        .html(function(d) {
            return ('${d.state}<br>${label} ${d[chosenXAxis]}');
        });
    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        //onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.show(data);
        });
    return circlesGroup;  
}

//Retrieve data from the CSV file and execute everything below
d3.csv("")