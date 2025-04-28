export function createPopularityChart(data, selector) {
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

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0.3, 1])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0.2, 1])
        .range([height, 0]);
    
    svg.append("g")
        .call(d3.axisLeft(y));

    // Create color scale for genres
    const genres = [...new Set(data.map(d => d.genre))];
    const color = d3.scaleOrdinal()
        .domain(genres)
        .range(d3.schemeTableau10);

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

    // Add bubbles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.danceability))
        .attr("cy", d => y(d.energy))
        .attr("r", 0)
        .style("fill", d => color(d.genre))
        .style("opacity", 0.7)
        .attr("stroke", "white")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Genre: ${d.genre}<br/>Danceability: ${d.danceability}<br/>Energy: ${d.energy}<br/>Popularity: ${d.popularity}`)
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

    // Add legend for genres
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 120}, 0)`);

    // Select 5 major genres for the legend to avoid overcrowding
    const mainGenres = ["Pop", "Rock", "Hip-Hop", "Electronic", "Classical"];
    
    mainGenres.forEach((genre, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 6)
            .style("fill", color(genre));
        
        legendRow.append("text")
            .attr("x", 10)
            .attr("y", 5)
            .style("font-size", "12px")
            .text(genre);
    });

    // Add legend for bubble size
    const sizeLegend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 120}, ${mainGenres.length * 20 + 20})`);

    sizeLegend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size", "12px")
        .text("Bubble size = Popularity");

    // Add labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .text("Danceability");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .text("Energy");
}