function createEdgeBundlingChart(data, selector) {
  // Calculate similarity between genres based on attributes
  const genres = [...new Set(data.map(d => d.genre))];
  const genreData = {};
  
  // Aggregate attributes by genre
  genres.forEach(genre => {
    const genreSongs = data.filter(d => d.genre === genre);
    genreData[genre] = {
      danceability: d3.mean(genreSongs, d => d.danceability),
      energy: d3.mean(genreSongs, d => d.energy),
      acousticness: d3.mean(genreSongs, d => d.acousticness),
      valence: d3.mean(genreSongs, d => d.valence),
      popularity: d3.mean(genreSongs, d => d.popularity) / 100
    };
  });
  
  // Calculate connections based on similarity threshold
  const links = [];
  const similarityThreshold = 0.75; // Lowered for more connections
  
  for (let i = 0; i < genres.length; i++) {
    for (let j = i + 1; j < genres.length; j++) {
      const genre1 = genres[i];
      const genre2 = genres[j];
      
      // Calculate similarity (Euclidean distance normalized)
      const features = ["danceability", "energy", "acousticness", "valence", "popularity"];
      let sumSquaredDiff = 0;
      
      features.forEach(feature => {
        const diff = genreData[genre1][feature] - genreData[genre2][feature];
        sumSquaredDiff += diff * diff;
      });
      
      const distance = Math.sqrt(sumSquaredDiff / features.length);
      const similarity = 1 - distance;
      
      if (similarity > similarityThreshold) {
        links.push({
          source: genre1,
          target: genre2,
          value: similarity
        });
      }
    }
  }
  
  // Create hierarchical structure for the visualization
  const hierarchyData = {
    name: "music",
    children: genres.map(genre => ({ name: genre }))
  };
  
  // Set up dimensions
  const width = 700;
  const height = 700;
  const radius = Math.min(width, height) / 2 - 50;
  
  // Clear previous SVG
  d3.select(selector).html("");
  
  // Create SVG
  const svg = d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);
  
  // Create cluster layout
  const cluster = d3.cluster()
    .size([360, radius]);
  
  // Create hierarchy
  const root = d3.hierarchy(hierarchyData)
    .sort((a, b) => d3.ascending(a.data.name, b.data.name));
  
  cluster(root);
  
  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  // Map nodes by name for easy lookup
  const nodeByName = {};
  
  root.descendants().forEach(node => {
    if (node.data.name !== "music") {
      nodeByName[node.data.name] = node;
    }
  });
  
  // Process links with actual node references
  const processedLinks = [];
  
  links.forEach(link => {
    const sourceNode = nodeByName[link.source];
    const targetNode = nodeByName[link.target];
    
    if (sourceNode && targetNode) {
      processedLinks.push({
        source: sourceNode,
        target: targetNode,
        value: link.value
      });
    }
  });
  
  // Prepare the line generator
  const lineGenerator = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x * Math.PI / 180);
  
  // Draw the connections
  svg.selectAll("path.link")
    .data(processedLinks)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => {
      return lineGenerator([d.source, d.target]);
    })
    .style("fill", "none")
    .style("stroke", d => d3.interpolateBlues(d.value))
    .style("stroke-width", d => d.value * 2)
    .style("opacity", 0.7);
  
  // Add genre nodes
  const genreNodes = svg.selectAll(".node")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `rotate(${d.x - 90}) translate(${d.y}, 0)`);
  
  genreNodes.append("circle")
    .attr("r", 4)
    .style("fill", d => color(d.data.name));
  
  genreNodes.append("text")
    .attr("dy", "0.31em")
    .attr("transform", d => d.x < 180 ? "translate(8)" : "rotate(180) translate(-8)")
    .style("text-anchor", d => d.x < 180 ? "start" : "end")
    .text(d => d.data.name)
    .style("font-size", "10px");
  
  // Add legend for connection strength
  const legendWidth = 200;
  const legendHeight = 20;
  const legendX = -width/2 + 50;
  const legendY = -height/2 + 50;
  
  const legend = svg.append("g")
    .attr("transform", `translate(${legendX}, ${legendY})`);
  
  // Create gradient for legend
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "edge-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
  
  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", d3.interpolateBlues(similarityThreshold));
  
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", d3.interpolateBlues(1));
  
  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#edge-gradient)");
  
  legend.append("text")
    .attr("x", 0)
    .attr("y", -5)
    .text("Genre Similarity");
  
  legend.append("text")
    .attr("x", 0)
    .attr("y", legendHeight + 15)
    .text("Lower");
  
  legend.append("text")
    .attr("x", legendWidth)
    .attr("y", legendHeight + 15)
    .attr("text-anchor", "end")
    .text("Higher");
}
