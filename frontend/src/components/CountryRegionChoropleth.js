import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CountryRegionChoropleth = () => {
    const [data, setData] = useState([]);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountryRegionData = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/insights/country-region-distribution');
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching country-region data:', error);
                setLoading(false);
            }
        };

        const fetchGeoJsonData = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json");
                const geoData = await response.json();
                setGeoJsonData(geoData);
            } catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        };

        fetchCountryRegionData();
        fetchGeoJsonData();
    }, []);

    if (loading || !geoJsonData) return <div>Loading data...</div>;

    const getColor = (count) => {
        return count > 100 ? '#800026' :
               count > 50  ? '#BD0026' :
               count > 20  ? '#E31A1C' :
               count > 10  ? '#FC4E2A' :
               count > 5   ? '#FD8D3C' :
               count > 1   ? '#FEB24C' :
                             '#FFEDA0';
    };

    const style = (feature) => {
        const countryData = data.find(item => item.country === feature.properties.name);
        return {
            fillColor: countryData ? getColor(countryData.count) : '#FFEDA0',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    const Legend = () => {
        const map = useMap();

        useEffect(() => {
            const legend = L.control({ position: 'bottomright' });

            legend.onAdd = () => {
                const div = L.DomUtil.create('div', 'info legend');
                const grades = [0, 1, 5, 10, 20, 50, 100];
                const labels = [];

                // Generate a label with a colored square for each interval
                for (let i = 0; i < grades.length; i++) {
                    const from = grades[i];
                    const to = grades[i + 1];

                    labels.push(
                        `<i style="background:${getColor(from + 1)}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ${
                            from}${to ? `&ndash;${to}` : '+'}`
                    );
                }

                div.innerHTML = `<h4>Country Count</h4>${labels.join('<br>')}`;
                return div;
            };

            legend.addTo(map);

            // Cleanup the legend on component unmount
            return () => {
                legend.remove();
            };
        }, [map]);

        return null;
    };

    return (
        <div>
            <h2>Country and Region Distribution</h2>
            <MapContainer style={{ height: '500px', width: '100%' }} zoom={2} center={[20, 0]}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {geoJsonData && (
                    <GeoJSON
                        data={geoJsonData}
                        style={style}
                        onEachFeature={(feature, layer) => {
                            const countryData = data.find(item => item.country === feature.properties.name);
                            layer.bindPopup(
                                `<strong>${feature.properties.name}</strong><br />Count: ${countryData ? countryData.count : 'N/A'}`
                            );
                        }}
                    />
                )}
                <Legend /> {/* Add Legend to the map */}
            </MapContainer>
        </div>
    );
};

export default CountryRegionChoropleth;