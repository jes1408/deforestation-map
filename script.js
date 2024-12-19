// Mapbox Access Token and Initial Map Setup
mapboxgl.accessToken = 'pk.eyJ1IjoiamVzbHluMTQwOCIsImEiOiJjbG02NjVzOHcyeW00M2RwNG5zdW1zcW0zIn0.ohEByCypwDxfYoS0wkwyfA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // Mapbox base map in 'dark' style
    center: [106.3, 5.9], // Map center coordinates
    zoom: 5 // Initial zoom level
});

const zoomThreshold = 6.5; // Zoom threshold for switching between state and district layers

// Map Load Event
map.on('load', () => {
    // Add data sources
    addSources();

    // Add layers
    addHillshadeLayer();
    addHeatmapLayer();
    addLocationPointsLayer();
    addBubbleMapLayer();
    addStateChoroplethLayer();
    addDistrictChoroplethLayer();
});

// Add Mapbox data sources
function addSources() {
    map.addSource('future-deforest', {
        type: 'vector',
        url: 'mapbox://jeslyn1408.66wb7e5p'
    });
    map.addSource('state', {
        type: 'vector',
        url: 'mapbox://jeslyn1408.6pfj0wqg'
    });
    map.addSource('district', {
        type: 'vector',
        url: 'mapbox://jeslyn1408.3chwzhvf'
    });
    map.addSource('dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1'
    });
}

// Add hillshade layer
function addHillshadeLayer() {
    map.addLayer({
        id: 'hillshading',
        source: 'dem',
        type: 'hillshade'
    }, 'land-structure-polygon');
}

// Add heatmap layer
function addHeatmapLayer() {
    map.addLayer({
        id: 'Heat-map',
        type: 'heatmap',
        source: 'future-deforest',
        'source-layer': 'fdeforest-1wdrg5',
        maxzoom: 9,
        layout: {
            visibility: 'visible'
        },
        paint: {
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'ForestLossAreas'],
                113104, 1
            ],
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 10,
                9, 20
            ],
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                9, 0
            ]
        }
    }, 'waterway-label');
}

// Add location points layer
function addLocationPointsLayer() {
    map.addLayer({
        id: 'Location points',
        type: 'circle',
        source: 'future-deforest',
        layout: {
            visibility: 'visible'
        },
        'source-layer': 'fdeforest-1wdrg5',
        minzoom: 7,
        paint: {
            'circle-radius': 4,
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'ForestLossAreas'],
                0, 'rgba(33,102,172,0)',
                1, 'rgb(209,229,240)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 0,
                8, 1
            ]
        }
    }, 'waterway-label');
}

// Add bubble map layer
function addBubbleMapLayer() {
    map.addLayer({
        id: 'Bubble map',
        type: 'circle',
        source: 'future-deforest',
        'source-layer': 'fdeforest-1wdrg5',
        layout: {
            visibility: 'none'
        },
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0.1, ['interpolate', ['linear'], ['get', 'ForestLossAreas'], 0, 1, 100, 5, 500, 10, 1000, 15, 10000, 20, 100000, 25],
                5, ['interpolate', ['linear'], ['get', 'ForestLossAreas'], 0, 4, 100, 6, 500, 11, 1000, 16, 10000, 21, 100000, 60]
            ],
            'circle-color': [
                'match',
                ['get', 'Sectors'],
                'Agriculture (other)', '#fbb03b',
                'Aquaculture', '#fbb03b',
                'Forest Plantation', '#fbb03b',
                'Infrastructure (private)', '#3bb2d0',
                'Infrastructure (public)', '#FF73DF',
                'Mining and Quarrying', '#20d9ae',
                'Palm Oil', '#fbb03b',
                'Unknown clearance', '#895A44',
                '#000000' // Default color for unmatched values
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0,
                7, 1
            ]
        }
    }, 'waterway-label');
}

// Add state choropleth layer
function addStateChoroplethLayer() {
    map.addLayer({
        id: 'state-area',
        source: 'state',
        'source-layer': 'choropleth-state-cflpkp',
        layout: {
            visibility: 'none'
        },
        maxzoom: zoomThreshold,
        type: 'fill',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'area_bysta'],
                0, '#FFFFFF',
                0.01, '#bfc1e2',
                0.1, '#9793c6',
                1, '#6b5cb4',
                3, '#5b2e9e',
                7, '#340166'
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
        }
    }, 'road-label-simple');
}

// Add district choropleth layer
function addDistrictChoroplethLayer() {
    map.addLayer({
        id: 'district-area',
        source: 'district',
        'source-layer': 'choropleth-district-6tjd0r',
        layout: {
            visibility: 'none'
        },
        minzoom: zoomThreshold,
        type: 'fill',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'areabydist'],
                0, '#FFFFFF',
                0.01, '#bfc1e2',
                0.1, '#9793c6',
                1, '#6b5cb4',
                3, '#5b2e9e',
                7, '#340166'
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
        }
    }, 'road-label-simple');
}

// Add interactivity
map.on('mousemove', handleMouseMove);
map.on('mouseleave', 'Location points', handleMouseLeave);

// Handle mouse move over points
function handleMouseMove(e) {
    const features = map.queryRenderedFeatures(e.point, { layers: ['Location points'] });
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    popup
        .setLngLat(e.lngLat)
        .setHTML(`
            Company: ${features[0].properties.Companies}<br>
            Location: ${features[0].properties.Locations}<br>
            Concession Area (ha): ${features[0].properties.ConcessionAreas}<br>
            Land Status: ${features[0].properties.LandStatus}<br>
            Potential Forest Loss (ha): ${features[0].properties.ForestLossAreas}<br>
            Sector: ${features[0].properties.Sectors}
        `)
        .addTo(map);
}

// Handle mouse leave from points
function handleMouseLeave() {
    map.getCanvas().style.cursor = '';
    popup.remove();
}

// Popup for interactivity
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});
