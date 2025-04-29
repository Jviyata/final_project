// Import chart modules
import { createEdgeBundlingChart } from 'js/EdgeBundlingChart.js';
import { createHeatmapChart } from 'js/Heatmap.js';
import { createRadarChart } from 'js/RadarChart.js';

// Sample data for the charts (would be loaded from an API/CSV in a real app)
// Spotify song attributes dataset sample

// Data for our visualizations - combining attributes for various genres
const musicData = [
    { danceability: 0.72, energy: 0.82, acousticness: 0.12, valence: 0.82, popularity: 89, genre: "Pop" },
    { danceability: 0.65, energy: 0.93, acousticness: 0.08, valence: 0.65, popularity: 76, genre: "Rock" },
    { danceability: 0.87, energy: 0.73, acousticness: 0.05, valence: 0.90, popularity: 92, genre: "Dance" },
    { danceability: 0.55, energy: 0.40, acousticness: 0.78, valence: 0.72, popularity: 65, genre: "Folk" },
    { danceability: 0.60, energy: 0.95, acousticness: 0.04, valence: 0.30, popularity: 72, genre: "Metal" },
    { danceability: 0.82, energy: 0.78, acousticness: 0.23, valence: 0.75, popularity: 85, genre: "R&B" },
    { danceability: 0.88, energy: 0.62, acousticness: 0.07, valence: 0.60, popularity: 79, genre: "Hip-Hop" },
    { danceability: 0.45, energy: 0.31, acousticness: 0.86, valence: 0.68, popularity: 58, genre: "Classical" },
    { danceability: 0.73, energy: 0.65, acousticness: 0.45, valence: 0.55, popularity: 81, genre: "Indie" },
    { danceability: 0.78, energy: 0.75, acousticness: 0.06, valence: 0.72, popularity: 88, genre: "Electronic" },
    { danceability: 0.59, energy: 0.57, acousticness: 0.67, valence: 0.45, popularity: 63, genre: "Jazz" },
    { danceability: 0.68, energy: 0.80, acousticness: 0.21, valence: 0.38, popularity: 70, genre: "Alternative" },
    { danceability: 0.81, energy: 0.71, acousticness: 0.18, valence: 0.85, popularity: 84, genre: "Latin" },
    { danceability: 0.77, energy: 0.88, acousticness: 0.03, valence: 0.70, popularity: 76, genre: "EDM" },
    { danceability: 0.51, energy: 0.48, acousticness: 0.72, valence: 0.32, popularity: 61, genre: "Blues" }
];

// Initialize charts when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the new charts
    createEdgeBundlingChart(musicData, '#edge-bundling-chart');
    createHeatmapChart(musicData, '#heatmap-chart');
    createRadarChart(musicData, '#radar-chart');
});
