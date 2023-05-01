import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-editable';
import localgeojson from "./maps/ukraine.json";

function Edit() {
    useEffect(() => {
        var map = L.map('map', {editable: true});
        var polyline = L.polyline([[43.1, 1.2], [43.2, 1.3],[43.3, 1.2]]).addTo(map);
        polyline.enableEdit();
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }).addTo(map);
    });
    return <div id="map" style={{ height: '600px' }} />;
}

export default Edit;