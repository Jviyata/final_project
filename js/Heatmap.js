function createHeatmapChart(data, selector) {
  // Group data by genre and calculate average values
  const genreMap = d3.rollup(
    data,
    v => ({
      danceability: d3.mean(v, d => d.danceability),
      energy: d3.mean(v, d => d.energy),
      acousticness: d3.mean(v, d => d.acousticness),
      valence: d3.mean(v, d => d.valence),
      popularity: d3.mean(v, d => d.popularity) / 100
    }),
    d => d.genre
  );
  
  // Convert to array format for heatmap
  const genres = Array.from(genreMap.keys());
  const features = ["danceability", "energy", "acousticness", "valence", "popularity"];
  
  // Create heatmap data array
  const heatmapData = [];
  genres.forEach(genre => {
    const values = genreMap.get(genre);
    features.forEach(feature => {
      heatmapData.push({
        genre: genre,
        feature: feature,
        value: values[feature]
      });
    });
  });
  
  // Set the dimensions and margins
  const margin = { top: 50, right: 30, bottom: 100, left: 120 };
  const width = 700 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // Clear previous SVG
  d3.select(selector).html("");
  
  // Create SVG
  const svg = d3.select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Build X scale and axis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(features)
    .padding(0.05);
  
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  
  // Build Y scale and axis
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(genres)
    .padding(0.05);
  
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Build color scale
  const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0, 1]);
  
  // Create tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");
  
  // Add heatmap cells
  svg.selectAll()
    .data(heatmapData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.feature))
    .attr("y", d => y(d.genre))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => colorScale(d.value))
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", function(event, d) {
      tooltip.style("opacity", 1);
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
    })
    .on("mousemove", function(event, d) {
      tooltip
        .html(`Genre: ${d.genre}<br>${d.feature}: ${d.value.toFixed(2)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseleave", function(event, d) {
      tooltip.style("opacity", 0);
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
    });
  
  // Add title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Music Genre Attributes Heatmap");
  
  // Add color legend
  const legendWidth = width * 0.6;
  const legendHeight = 15;
  const legendPosition = { x: width/2 - legendWidth/2, y: height + 70 };
  
  const legend = svg.append("g")
    .attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`);
  
  // Create gradient for legend
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "heatmap-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
  
  // Add color stops
  const stops = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  stops.forEach(stop => {
    gradient.append("stop")
      .attr("offset", `${stop * 100}%`)
      .attr("stop-color", colorScale(stop));
  });
  
  // Draw rectangle with gradient fill
  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#heatmap-gradient)");
  
  // Add legend axis
  const legendScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, legendWidth]);
  
  legend.append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(d3.axisBottom(legendScale)
      .tickSize(6)
      .tickValues([0, 0.2, 0.4, 0.6, 0.8, 1])
      .tickFormat(d3.format(".1f")));
  
  legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", legendHeight + 30)
    .attr("text-anchor", "middle")
    .text("Attribute Value");
}
