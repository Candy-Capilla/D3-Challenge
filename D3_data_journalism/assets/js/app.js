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
var chosenYAxis = "healthcare";

//function used for updating x-scale var upon click on axis label
function xScale(Pdata, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Pdata, d => d[chosenXAxis]) * 0.8,
          d3.max(Pdata, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}
//function used for updating y-scale var upon click on axis label
function yScale(Pdata, chosenYAxis) {
    //create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(Pdata, d => d[chosenYAxis]) *0.8,
          d3.max(Pdata, d => d[chosenYAxis]) * 1.2    
        ])
        .range([0,height]);
    return yLinearScale;
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
            toolTip.hide(data);
        });
    return circlesGroup;  
}

function updateToolTipY (chosenYAxis, circlesGroup){
    var labely;

    if(chosenYAxis === "obesity") {
        labely = "Obesity (%)";
    }
    else if (chosenYAxis === "smokes") {
        labely = "Smokes (%)";
    }
    else if (chosenXAxis === "healthcare") {
        labely = "Lacks Healthcare (%)";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return ('${d.state}<br>${label} ${d[chosenYAxis]}');
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(date) {
        toolTip.show(data);
    })
        //onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

//Retrieve data from the CSV file and execute everything below
d3.csv("../data/data.csv").then(function(Pdata, err) {
    if (err) throw err;

    //Parse data
    Pdata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    //xlinearScale function above csv
    var xLinearScale = xScale(Pdata, chosenXAxis);
    
    //create y scale function
    var yLinearScale = yScale(Pdata, chosenYAxis);
    
    //create initial axis function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3. axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", 'translate(0, ${height})')
        .call(bottomAxis);

    //append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", 'translate(0, ${height})')
        .call(leftAxis);

    //append intial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(Pdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "cyan")
        .attr("opacity", ".5");
    
    //create group for labels
    var labelsgroup = chartGroup.append("g")
        .attr("transform", 'translate(${width /2}, ${height +20})');

    var povertyLabel = labelsgroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") //value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") //value to grab for event listener
    .classed("active", true)
    .text("Age (Median");

    var incomeLabel = labelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") //value to grab for event listener
    .classed("active", true)
    .text("Household Income (Median");

    var obesityLabel = labelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") //value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var smokesLabel = labelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") //value to grab for event listener
    .classed("active", true)
    .text("Age (Median");

    var healthcareLabel = labelsgroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") //value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");



}