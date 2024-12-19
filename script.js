mapboxgl.accessToken = 'pk.eyJ1IjoiamVzbHluMTQwOCIsImEiOiJjbG02NjVzOHcyeW00M2RwNG5zdW1zcW0zIn0.ohEByCypwDxfYoS0wkwyfA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [106.3, 5.9],
    zoom: 5
});

const zoomThreshold = 6.5;

map.on('load', () => {
    // Add sources
    map.addSource('future-deforest', { type: 'vector', url: 'mapbox://jeslyn1408.66wb7e5p' });
    map.addSource('state', { type: 'vector', url: 'mapbox://jeslyn1408.6pfj0wqg' });
    map.addSource('district', { type: 'vector', url: 'mapbox://jeslyn1408.3chwzhvf' });
    map.addSource('dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1' });

    // Add hillshade layer
    map.addLayer({
        id: 'hillshading',
        source: 'dem',
        type: 'hillshade'
    }, 'land-structure-polygon');

    // Add heatmap layer
    map.addLayer({
        id: 'Heat-map',
        type: 'heatmap',
        source: 'future-deforest',
        'source-layer': 'fdeforest-1wdrg5',
        maxzoom: 9,
        layout: { visibility: 'visible' },
        paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'ForestLossAreas'], 113104, 1],
            'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(33,102,172,0)', 0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)', 0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)', 1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 9, 20],
            'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
        }
    }, 'waterway-label');

    // Add location points layer
    map.addLayer({
        id: 'Location points',
        type: 'circle',
        source: 'future-deforest',
        'source-layer': 'fdeforest-1wdrg5',
        minzoom: 7,
        layout: { visibility: 'visible' },
        paint: {
            'circle-radius': 4,
            'circle-color': [
                'interpolate', ['linear'], ['get', 'ForestLossAreas'],
                0, 'rgba(33,102,172,0)', 1, 'rgb(209,229,240)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1]
        }
    }, 'waterway-label');

    // Add bubble map layer
    map.addLayer({
        id: 'Bubble map',
        type: 'circle',
        source: 'future-deforest',
        'source-layer': 'fdeforest-1wdrg5',
        layout: { visibility: 'none' },
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                0.1, ['interpolate', ['linear'], ['get', 'ForestLossAreas'], 0, 1, 100000, 25],
                5, ['interpolate', ['linear'], ['get', 'ForestLossAreas'], 0, 4, 100000, 60]
            ],
            'circle-color': [
                'match', ['get', 'Sectors'],
                'Agriculture (other)', '#fbb03b',
                'Mining and Quarrying', '#20d9ae',
                'Infrastructure (private)', '#3bb2d0',
                'Unknown clearance', '#895A44', '#000000'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': ['interpolate', ['linear'], ['zoom'], 6, 0, 7, 1]
        }
    }, 'waterway-label');

    // Add state and district choropleth layers
    map.addLayer({
        id: 'state-area',
        source: 'state',
        'source-layer': 'choropleth-state-cflpkp',
        maxzoom: zoomThreshold,
        type: 'fill',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': [
                'interpolate', ['linear'], ['get', 'area_bysta'],
                0, '#FFFFFF', 7, '#340166'
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
        }
    }, 'road-label-simple');

    map.addLayer({
        id: 'district-area',
        source: 'district',
        'source-layer': 'choropleth-district-6tjd0r',
        minzoom: zoomThreshold,
        type: 'fill',
        layout: { visibility: 'none' },
        paint: {
            'fill-color': [
                'interpolate', ['linear'], ['get', 'areabydist'],
                0, '#FFFFFF', 7, '#340166'
            ],
            'fill-opacity': 0.8,
            'fill-outline-color': 'white'
        }
    }, 'road-label-simple');
});

// Popup for location points
const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

map.on('mousemove', (e) => {
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
});

map.on('mouseleave', 'Location points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});
