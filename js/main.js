// Import chart modules
import { createTrendChart } from './trendChart.js';
import { createPopularityChart } from './popularityChart.js';
import { createClusterChart } from './clusterChart.js';

// Sample data for the charts (would be loaded from an API/CSV in a real app)
// Spotify song attributes dataset sample

// Trend chart data - Evolution of music features over time
const trendData = [
    { year: 1960, energy: 0.42, danceability: 0.45, acousticness: 0.82 },
    { year: 1965, energy: 0.45, danceability: 0.48, acousticness: 0.78 },
    { year: 1970, energy: 0.51, danceability: 0.52, acousticness: 0.72 },
    { year: 1975, energy: 0.55, danceability: 0.56, acousticness: 0.65 },
    { year: 1980, energy: 0.58, danceability: 0.61, acousticness: 0.55 },
    { year: 1985, energy: 0.62, danceability: 0.63, acousticness: 0.45 },
    { year: 1990, energy: 0.65, danceability: 0.64, acousticness: 0.38 },
    { year: 1995, energy: 0.67, danceability: 0.65, acousticness: 0.32 },
    { year: 2000, energy: 0.70, danceability: 0.68, acousticness: 0.28 },
    { year: 2005, energy: 0.72, danceability: 0.70, acousticness: 0.23 },
    { year: 2010, energy: 0.74, danceability: 0.72, acousticness: 0.19 },
    { year: 2015, energy: 0.75, danceability: 0.74, acousticness: 0.16 },
    { year: 2020, energy: 0.73, danceability: 0.75, acousticness: 0.18 },
    { year: 2025, energy: 0.72, danceability: 0.77, acousticness: 0.21 }
];

// Popularity chart data - Danceability, energy, and popularity
const popularityData = [
    { danceability: 0.72, energy: 0.82, popularity: 89, genre: "Pop" },
    { danceability: 0.65, energy: 0.93, popularity: 76, genre: "Rock" },
    { danceability: 0.87, energy: 0.73, popularity: 92, genre: "Dance" },
    { danceability: 0.55, energy: 0.40, popularity: 65, genre: "Folk" },
    { danceability: 0.60, energy: 0.95, popularity: 72, genre: "Metal" },
    { danceability: 0.82, energy: 0.78, popularity: 85, genre: "R&B" },
    { danceability: 0.88, energy: 0.62, popularity: 79, genre: "Hip-Hop" },
    { danceability: 0.45, energy: 0.31, popularity: 58, genre: "Classical" },
    { danceability: 0.73, energy: 0.65, popularity: 81, genre: "Indie" },
    { danceability: 0.78, energy: 0.75, popularity: 88, genre: "Electronic" },
    { danceability: 0.59, energy: 0.57, popularity: 63, genre: "Jazz" },
    { danceability: 0.68, energy: 0.80, popularity: 70, genre: "Alternative" },
    { danceability: 0.81, energy: 0.71, popularity: 84, genre: "Latin" },
    { danceability: 0.77, energy: 0.88, popularity: 76, genre: "EDM" },
    { danceability: 0.51, energy: 0.48, popularity: 61, genre: "Blues" }
];

// Cluster chart data - Valence, energy, acousticness, and popularity
const clusterData = [
    { valence: 0.82, energy: 0.75, acousticness: 0.12, popularity: 87, genre: "Pop" },
    { valence: 0.65, energy: 0.93, acousticness: 0.08, popularity: 76, genre: "Rock" },
    { valence: 0.90, energy: 0.80, acousticness: 0.05, popularity: 92, genre: "Dance" },
    { valence: 0.72, energy: 0.35, acousticness: 0.78, popularity: 65, genre: "Folk" },
    { valence: 0.30, energy: 0.95, acousticness: 0.04, popularity: 72, genre: "Metal" },
    { valence: 0.75, energy: 0.68, acousticness: 0.23, popularity: 85, genre: "R&B" },
    { valence: 0.60, energy: 0.78, acousticness: 0.07, popularity: 83, genre: "Hip-Hop" },
    { valence: 0.68, energy: 0.25, acousticness: 0.86, popularity: 58, genre: "Classical" },
    { valence: 0.55, energy: 0.65, acousticness: 0.45, popularity: 73, genre: "Indie" },
    { valence: 0.72, energy: 0.85, acousticness: 0.06, popularity: 88, genre: "Electronic" },
    { valence: 0.45, energy: 0.40, acousticness: 0.67, popularity: 63, genre: "Jazz" },
    { valence: 0.38, energy: 0.75, acousticness: 0.21, popularity: 70, genre: "Alternative" },
    { valence: 0.85, energy: 0.80, acousticness: 0.18, popularity: 84, genre: "Latin" },
    { valence: 0.70, energy: 0.92, acousticness: 0.03, popularity: 78, genre: "EDM" },
    { valence: 0.32, energy: 0.38, acousticness: 0.72, popularity: 61, genre: "Blues" }
];

// Initialize charts when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    createTrendChart(trendData, '#trend-chart');
    createPopularityChart(popularityData, '#popularity-chart');
    createClusterChart(clusterData, '#cluster-chart');
});
