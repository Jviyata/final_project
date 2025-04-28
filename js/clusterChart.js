export function createClusterChart(data, selector) {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
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

    // Add X axis - Valence (musical positiveness)
    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis - Energy
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Create color scale for acousticness
    const color = d3.scaleSequential()
        .domain([0, 1])
        .interpolator(d3.interpolateViridis);

    // Create size scale for popularity
    const size = d3.scaleLinear()
        .domain([d3.min(data, d => d.popularity), d3.max(data, d => d.popularity)])
        .range([5, 20]);

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

    // Add bubbles with animation
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.valence))
        .attr("cy", d => y(d.energy))
        .attr("r", 0)
        .style("fill", d => color(d.acousticness))
        .style("opacity", 0.7)
        .attr("stroke", "white")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Genre: ${d.genre}<br/>Valence: ${d.valence.toFixed(2)}<br/>Energy: ${d.energy.toFixed(2)}<br/>Acousticness: ${d.acousticness.toFixed(2)}<br/>Popularity: ${d.popularity}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).style("opacity", 1).attr("stroke", "black");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).style("opacity", 0.7).attr("stroke", "white");
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .attr("r", d => size(d.popularity));

    // Add color legend for acousticness
    const legendWidth = 120;
    const legendHeight = 10;
    
    const legendScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d3.format(".1f"));
    
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - legendWidth - 30}, 10)`);
    
    // Create the gradient
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
        .attr("id", "acousticness-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    
    // Add the color stops
    const colorStops = [0, 0.2, 0.4, 0.6, 0.8, 1];
    
    colorStops.forEach(stop => {
        gradient.append("stop")
            .attr("offset", `${stop * 100}%`)
            .attr("stop-color", color(stop));
    });
    
    // Draw the rectangle with gradient fill
    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#acousticness-gradient)");
    
    // Add the axis
    legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .append("text")
        .attr("x", legendWidth / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "#000")
        .style("font-size", "12px")
        .text("Acousticness");

    // Add another legend for bubble size
    const sizeLegend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - legendWidth - 30}, 70)`);

    sizeLegend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "12px")
        .text("Bubble size = Popularity");

    // Draw example bubbles
    const popularityValues = [60, 75, 90];
    const bubbleSpacing = 30;
    
    popularityValues.forEach((value, i) => {
        sizeLegend.append("circle")
            .attr("cx", 10)
            .attr("cy", i * bubbleSpacing + 20)
            .attr("r", size(value))
            .style("fill", "gray")
            .style("opacity", 0.7);
        
        sizeLegend.append("text")
            .attr("x", 30)
            .attr("y", i * bubbleSpacing + 25)
            .style("font-size", "12px")
            .text(value);
    });
    
    // Add labels for the axes
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .text("Valence (Musical Positiveness)");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .text("Energy");
}
