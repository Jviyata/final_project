function createEdgeBundlingChart(data, selector) {
  const genres = [...new Set(data.map(d => d.genre))];
  const genreData = {};

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

  const links = [];
  const similarityThreshold = 0.7;

  for (let i = 0; i < genres.length; i++) {
    for (let j = i + 1; j < genres.length; j++) {
      const genre1 = genres[i];
      const genre2 = genres[j];
      const features = ["danceability", "energy", "acousticness", "valence", "popularity"];
      let sumSquaredDiff = 0;
      features.forEach(feature => {
        const diff = genreData[genre1][feature] - genreData[genre2][feature];
        sumSquaredDiff += diff * diff;
      });
      const distance = Math.sqrt(sumSquaredDiff / features.length);
      const similarity = 1 - distance;
      if (similarity > similarityThreshold) {
        links.push({ source: genre1, target: genre2, value: similarity });
      }
    }
  }

  const hierarchyData = {
    name: "music",
    children: genres.map(genre => ({ name: genre }))
  };

  const container = d3.select(selector);
  const containerWidth = container.node().getBoundingClientRect().width;
  const width = containerWidth || 700;
  const height = width;
  const radius = Math.min(width, height) / 2 - 80;

  d3.select(selector).html("");

  const svg = d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height + 100)
    .attr("viewBox", `0 0 ${width} ${height + 100}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const cluster = d3.cluster().size([360, radius]);
  const root = d3.hierarchy(hierarchyData).sort((a, b) => d3.ascending(a.data.name, b.data.name));
  cluster(root);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const nodeByName = {};
  root.descendants().forEach(node => {
    if (node.data.name !== "music") nodeByName[node.data.name] = node;
  });

  const processedLinks = [];
  links.forEach(link => {
    const sourceNode = nodeByName[link.source];
    const targetNode = nodeByName[link.target];
    if (sourceNode && targetNode) {
      processedLinks.push({ source: sourceNode, target: targetNode, value: link.value });
    }
  });

  const lineGenerator = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x * Math.PI / 180);

  const neonColorScale = d3.scaleLinear()
    .domain([similarityThreshold, 1])
    .range(["#39ff14", "#1f51ff"]); // neon green to neon blue

  const tooltip = d3.select(selector)
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("font-size", "12px");

  svg.selectAll("path.link")
    .data(processedLinks)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d => lineGenerator([d.source, d.target]))
    .style("fill", "none")
    .style("stroke", d => neonColorScale(d.value))
    .style("stroke-width", d => d.value * 3)
    .style("opacity", 0.9)
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible")
        .html(`Genres: ${d.source.data.name} & ${d.target.data.name}<br>Similarity: ${(d.value * 100).toFixed(2)}%`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  const genreNodes = svg.selectAll(".node")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `rotate(${d.x - 90}) translate(${d.y}, 0)`);

  genreNodes.append("circle")
    .attr("r", 5)
    .style("fill", d => color(d.data.name));

  genreNodes.append("text")
    .attr("dy", "0.31em")
    .attr("transform", d => d.x < 180 ? "translate(10)" : "rotate(180) translate(-10)")
    .style("text-anchor", d => d.x < 180 ? "start" : "end")
    .style("font-size", "12px")
    .style("font-family", "Arial, sans-serif")
    .style("fill", "white")
    .text(d => d.data.name);

  svg.append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .style("font-family", "Arial, sans-serif")
    .style("fill", "white")
    .text("Music Genre Similarities");

  // === GENRE LEGEND ===
  const genreLegend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${-width / 2 + 20}, ${-height / 2 + 40})`);

  genres.forEach((genre, i) => {
    const legendRow = genreLegend.append("g").attr("transform", `translate(0, ${i * 20})`);
    legendRow.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(genre));
    legendRow.append("text")
      .attr("x", 15)
      .attr("y", 10)
      .attr("fill", "white")
      .style("font-size", "12px")
      .text(genre);
  });

  // === SIMILARITY LEGEND ===
  const lineLegend = svg.append("g")
    .attr("class", "line-legend")
    .attr("transform", `translate(${-width / 2 + 20}, ${-height / 2 + 20 + genres.length * 20 + 30})`);

  lineLegend.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("fill", "white")
    .style("font-size", "12px")
    .text("Genre Similarity (Line Color)");

  const defs = svg.append("defs");
  const gradientId = "similarity-gradient";
  const gradient = defs.append("linearGradient")
    .attr("id", gradientId)
    .attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#39ff14");

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#1f51ff");

  lineLegend.append("rect")
    .attr("x", 0)
    .attr("y", 10)
    .attr("width", 120)
    .attr("height", 10)
    .style("fill", `url(#${gradientId})`);

  lineLegend.append("text")
    .attr("x", 0)
    .attr("y", 32)
    .style("fill", "white")
    .style("font-size", "10px")
    .text("Low");

  lineLegend.append("text")
    .attr("x", 120)
    .attr("y", 32)
    .style("fill", "white")
    .style("font-size", "10px")
    .attr("text-anchor", "end")
    .text("High");

  if (genres.length === 0) {
    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "white")
      .text("No data available to display");
  }

  console.log("Chart created with", genres.length, "genres and", processedLinks.length, "connections");
}
