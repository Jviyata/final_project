function createRadarChart(data, selector) {
  // Group data by genre and average the attributes
  const genreData = d3.rollup(
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
  
  // Convert to array format for radar chart
  const chartData = Array.from(genreData, ([genre, values]) => ({
    genre,
    ...values
  }));
  
  // Set dimensions
  const width = 600;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 60;
  
  // Features to include in the radar
  const features = ["danceability", "energy", "acousticness", "valence", "popularity"];
  
  // Create SVG
  d3.select(selector).html("");
  const svg = d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);
  
  // Scale for each axis
  const radialScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, radius]);
  
  // Create circular grid lines
  const ticks = [0.2, 0.4, 0.6, 0.8, 1];
  
  ticks.forEach(t => {
    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radialScale(t))
      .attr("stroke", "#ccc") // light gray
      .attr("fill", "none")
      .attr("stroke-dasharray", "2,2");
    
    svg.append("text")
      .attr("x", 5)
      .attr("y", -radialScale(t))
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("fill", "white") // white text
      .text(t.toString());
  });
  
  // Create axes
  const angleSlice = (Math.PI * 2) / features.length;
  
  features.forEach((feature, i) => {
    const angle = i * angleSlice;
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", radius * Math.cos(angle - Math.PI/2))
      .attr("y2", radius * Math.sin(angle - Math.PI/2))
      .attr("stroke", "#ccc") // light gray
      .attr("stroke-width", 1);
    
    svg.append("text")
      .attr("x", (radius + 10) * Math.cos(angle - Math.PI/2))
      .attr("y", (radius + 10) * Math.sin(angle - Math.PI/2))
      .attr("text-anchor", "middle")
      .style("fill", "white") // white text
      .text(feature);
  });
  
  // Create radar path generator
  const radarLine = d3.lineRadial()
    .radius(d => radialScale(d.value))
    .angle((d, i) => i * angleSlice);
  
  // Create color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Draw radar paths for each genre
  chartData.slice(0, 5).forEach((d, i) => {
    const dataValues = features.map(feature => ({
      value: d[feature]
    }));
    
    // Draw path
    svg.append("path")
      .datum(dataValues)
      .attr("d", radarLine)
      .attr("stroke", color(i))
      .attr("stroke-width", 2)
      .attr("fill", color(i))
      .attr("fill-opacity", 0.1);
    
    // Add dots at each point
    features.forEach((feature, j) => {
      const angle = j * angleSlice;
      svg.append("circle")
        .attr("cx", radialScale(d[feature]) * Math.cos(angle - Math.PI/2))
        .attr("cy", radialScale(d[feature]) * Math.sin(angle - Math.PI/2))
        .attr("r", 4)
        .attr("fill", color(i));
    });
  });
  
  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${-width/2 + 50}, ${-height/2 + 30})`);
  
  chartData.slice(0, 5).forEach((d, i) => {
    legend.append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(i));
    
    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 8)
      .text(d.genre)
      .style("font-size", "12px")
      .style("fill", "white"); // white legend text
  });
}
