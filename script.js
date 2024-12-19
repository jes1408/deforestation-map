mapboxgl.accessToken = 'pk.eyJ1IjoiamVzbHluMTQwOCIsImEiOiJjbG02NjVzOHcyeW00M2RwNG5zdW1zcW0zIn0.ohEByCypwDxfYoS0wkwyfA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [106.3, 5.9],
    zoom: 5
});

const zoomThreshold = 6.5;

map.on('load', () => {
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

    map.addLayer({
        id: 'hillshading',
        source: 'dem',
        type: 'hillshade'
    });

    // Add more layers as per your original code
});

map.on('idle', () => {
    const toggleableLayerIds = ['Heat-map & points', 'Bubble map', 'state-district area'];
    const layers = document.getElementById('menu');
    
    // Add toggle functionality for layers
});

// Popup functionality
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['Location points']
    });

    map.getCanvas().style.cursor = features.length ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    popup
        .setLngLat(e.lngLat)
        .setHTML(
            "Company: " + features[0].properties.Companies + "<br>" +
            "Location: " + features[0].properties.Locations
        )
        .addTo(map);
});

map.on('mouseleave', 'Location points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});
