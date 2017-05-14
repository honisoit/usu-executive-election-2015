var margin = {top: 5, right: 15, bottom: 5, left: 15};

var rowHeight = 100,
    rows = 4,
    height = ((rowHeight * rows) + 10) - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right,
    columnWidth = width / 5,
    gridMarginTop = -40;
    buttonY = 70,
    baubleRadius = 35,
    labelXOffset = 16;
    deal = 1; // Maximum 55 because the headshots are 110x110

function moveBaubles(dealNumber) {
    // make string to extract the colum and row numbers
    theColumn = "column" + dealNumber;
    theRow = "row" + dealNumber;

    // animate the baubles to the new spots
    candidate
        .transition()
        .duration(1000)
        .attr("transform", function(d, i) {
            return "translate(" + ((data[i][theColumn] * columnWidth) - (columnWidth / 2)) + "," + ((data[i][theRow] * rowHeight) + gridMarginTop) + ")"; });
}

function goToDeal(dealNumber) {
    if (dealNumber === 1) {
        d3.select("#explanation").text("Atia Rahim mistakenly voted for a presidential candidate (presumably Alisha) in the Vice-Presidential ballott and then, realising her mistake, decided to vote again (presumably for Liam). Everyone carried on peacefully for twenty minutes. Then realised they should probably think about what happened. Chaos ensued.");
    } else if (dealNumber === 2) {
        d3.select("#explanation").text("A deal was signed the morning of the meeting to hand Alisha the Presidency and give Liam, Ed, and Shannen the positions of Vice-President, Treasurer and Secretary respectively. It turns out signing a contract is easier than writing a name on a piece of paper.")
    };
    moveBaubles(dealNumber);
    pymChild.sendHeight();
}

function init() {
    // set up the buttons
    d3.select("#deal1").on("click", function() { goToDeal(1); });
    d3.select("#deal2").on("click", function() { goToDeal(2); });

    // set up the SVG margins and embed the group for the graphic
    var graphic = d3.select(".graphic")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.right + margin.left)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set up the definitions, patterns, and images for the bauble images
    definitions = graphic.selectAll("defs")
        .data(data)
        .enter()
        .append("defs");

    patterns = definitions
        .append("pattern")
        .attr("id", function(d, i) { return data[i].initials; })
        .attr("patternUnits", "objectBoundingBox")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 1)
        .attr("width", 1);

    images = patterns
        .append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", baubleRadius * 2)
        .attr("width", baubleRadius * 2)
        .attr("xlink:href", function(d, i) { return data[i].imgur; });

    // set up the tool-tip that will show when you hover over the baubles
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        tip.direction(function(d, i) {
            if( data[i][theColumn] <= 3) return 'e'
            if( data[i][theColumn] > 3) return 'w'
            })
        .html(function(d, i) {
            return "<h6>" + data[i].name + "</h6><p>Faction: " + data[i].faction + "</p><p>Campaign Slogan: " + data[i].campaign + "</p>";
                });

    graphic.call(tip);

    var battleLine = graphic
        .append("svg:line")
        .attr("x1", (width / 2))
        .attr("y1", 0)
        .attr("x2", (width / 2))
        .attr("y2", height)
        .attr("opacity", 1)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "15, 15")
        .attr("stroke", "black");

    // set up the groups for each candidate
    candidate = graphic.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(" + ((data[i].column1 * columnWidth) - (columnWidth / 2)) + "," + ((data[i].row1 * rowHeight) + gridMarginTop) + ")"; })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("touchend", tip.hide)
        .on("touchleave", tip.hide);

    baubles = candidate
        .append("circle")
        .attr("r", baubleRadius)
        .attr("fill", function(d, i) { return "url(#" + data[i].initials + ")";})
        .attr("stroke", function(d, i) { return data[i].colour; })
        .attr("stroke-width", 3);

    supporters = graphic
        .append("text")
        .attr("opacity", 1)
        .attr("x", (columnWidth))
        .attr("y", labelXOffset)
        .attr("class", "label")
        .text("For");

    losers = graphic
        .append("text")
        .attr("opacity", 1)
        .attr("x", (columnWidth * 4))
        .attr("y", labelXOffset)
        .attr("class", "label")
        .text("Against");

    goToDeal(1);
}
