export function createTrendChart(data, selector) {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 80, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select(selector).html("");

    // Append the svg object to the selector
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(10));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(["energy", "danceability", "acousticness"])
        .range(["#FF4560", "#00E396", "#775DD0"]);

    // Create tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Add lines for each metric
    const metrics = ["energy", "danceability", "acousticness"];
    
    metrics.forEach(metric => {
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d[metric]))
            .curve(d3.curveMonotoneX);
        
        // Draw the line with animation
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color(metric))
            .attr("stroke-width", 2.5)
            .attr("d", line)
            .attr("stroke-dasharray", function() { 
                return this.getTotalLength(); 
            })
            .attr("stroke-dashoffset", function() { 
                return this.getTotalLength(); 
            })
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        
        // Add circles for each data point
        svg.selectAll("dot-" + metric)
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d[metric]))
            .attr("r", 0)
            .attr("fill", color(metric))
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Year: ${d.year}<br/>${metric}: ${d[metric].toFixed(2)}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("r", 8);
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr("r", 5);
            })
            .transition()
            .duration(1000)
            .delay((d, i) => 2000 + (i * 50))
            .attr("r", 5);
    });

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 50}, 0)`);

    metrics.forEach((metric, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 6)
            .style("fill", color(metric));
        
        legendRow.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "12px")
            .text(metric.charAt(0).toUpperCase() + metric.slice(1));
    });

    // Add labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .text("Year");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .text("Value (0-1 scale)");
}