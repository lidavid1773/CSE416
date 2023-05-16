/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { setCoordinates, setNewRegion, setProperties } from '../features/geojson/geojsonSlice';

function GeoEditingMap() {
    const dispatch = useDispatch();
    const mapRef = useRef();
    const geojsonController = useSelector(state => state.geojsonController);
    const { geojson } = geojsonController;
    const [map, setMap] = useState(null);
    const [first, setFirst] = useState(true);

    var drawnItems;
    var isMerging = false;
    var isSimplifying = false;
    var selectedPolygon = null;
    var mergePolygon1 = null, mergePolygon2 = null;

    // const ViewProperties = (properties, layer) => {
    //     const container = L.DomUtil.create('div', 'props-container');
    //     let propsTable = L.DomUtil.create('table', 'div', container);
    //     const propsRow = propsTable.insertRow();
    //     propsRow.insertCell().innerHTML = `<button class="add-props-btn">+add properties</button>`;
    //     propsRow.addEventListener("click",()=>{
    //         const newRow = propsTable.insertRow(0);
    //         newRow.insertCell().innerHTML = `<input value="name:"></input>`;
    //         newRow.insertCell().innerHTML = `<input value="value"></input>`;
    //     });
    //     propsTable = L.DomUtil.create('table', 'props-table', container);
    //     for (const key of Object.keys(properties)) {
    //         const propsRow = propsTable.insertRow();
    //         propsRow.insertCell().innerHTML = `<input value="${key}"></input>`;
    //         propsRow.insertCell().innerHTML = `<input value="${properties[key]}"></input>`;
    //     }
        
    //     L.DomEvent.on(layer, 'click', (event) => {
    //         L.DomEvent.preventDefault(event);
    //         layer.bindPopup(container, {
    //             className: 'popup-content'
    //         }).openPopup();
    //     });
    // };

    useEffect(() => {
        if (!map) {
            const newMap = L.map('map', {
                pmIgnore: false
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            }).addTo(newMap);
            setMap(newMap);
        }
    }, []);

    useEffect(() => {
        if (map && geojson && first) {
            console.log(geojson)
            drawnItems = new L.FeatureGroup();
            geojson.features.forEach((currentFeature, featureIndex) => {
                addFeature(currentFeature, featureIndex, drawnItems);
            });
            map.pm.addControls({
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
                drawRectangle: false,
                drawCircle: false,
                drawText: false,
                editMode: false,
                cutPolygon: false,
                rotateMode: false,
                dragMode: false
            });

            var mergeOptions = {
                name: "merge",
                block: "custom",
                title: "Merge Regions",
                className: "leaflet-pm-icon-polyline",
                onClick: () => {
                    mergePolygon1 = null;
                    mergePolygon2 = null;
                    isMerging = !isMerging;
                }
            }
            var simplifyOptions = {
                name: "simplify",
                block: "custom",
                title: "Simplify Region",
                className: "leaflet-pm-icon-cut",
                onClick: () => {
                    isSimplifying = !isSimplifying;
                }
            }
            map.pm.Toolbar.createCustomControl(mergeOptions);
            map.pm.Toolbar.createCustomControl(simplifyOptions);
            map.pm.Toolbar.changeActionsOfControl("removalMode", ['cancel']);

            map.fitBounds(L.geoJson(geojson).getBounds());
            map.addLayer(drawnItems);

            map.on("pm:create", function (e) {
                e.layer.options.indices = { 
                    featureIndex: geojson.features.length, 
                    multiIndex: -1, 
                    polyIndex: 0, 
                    isMulti: false
                };
                addRegion(e.layer);
                dispatch(setNewRegion({ newRegion: e.layer.toGeoJSON() }));
            });
            setFirst(false);
        }
    }, [geojson]);

    //gets coordinates of polygon in GeoJSON object
    const getCoordinates = ({ featureIndex, multiIndex, polyIndex, isMulti }) => {
        if (isMulti)
            return geojson.features[featureIndex].geometry.coordinates[multiIndex][polyIndex];
        else
            return geojson.features[featureIndex].geometry.coordinates[polyIndex];
    }

    //adds feature onto the map
    const addFeature = (currentFeature, featureIndex) => {
        if (currentFeature.geometry.type === "MultiPolygon") {
            currentFeature.geometry.coordinates.forEach(function (currentCoordinate, index) {
                var multiIndex = index;
                currentCoordinate.forEach((poly, polyIndex) => convertToPolygon(poly, featureIndex, multiIndex, polyIndex, true));
            })
        } else {
            currentFeature.geometry.coordinates.forEach((poly, polyIndex) => convertToPolygon(poly, featureIndex, -1, polyIndex, false));
        }
    }

    //turn coordinates inside a GeoJson feature into a Leaflet Polygon
    const convertToPolygon = (poly, featureIndex, multiIndex, polyIndex, isMulti) => {
        //console.log(poly)
        var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(poly)).addTo(map);
        polygon.options.indices = { featureIndex, multiIndex, polyIndex, isMulti };
        addRegion(polygon);
    }
    
    //initialize polygon layer with all functionalities
    const addRegion = (polygon) => {
        drawnItems.addLayer(polygon);
        polygon.on('click', function (e) {
            if (selectedPolygon) {
                //return to original color
                selectedPolygon.setStyle({fillColor: "#3388ff"});
                selectedPolygon.pm.disable();
            }
            if (isMerging) 
                mergeRegions(e);
            if (isSimplifying)
                simplifyRegion(e);

            selectedPolygon = e.target;
            selectedPolygon.setStyle({fillColor: "red"});
            e.target.pm.enable();
            //view properties
            addPopup(e.target)
            // e.target.bindPopup('<pre>'+JSON.stringify(geojson.features[e.target.options.indices.featureIndex].properties,null,' ').replace(/[\{\}"]/g,'')+'</pre>')
            //         .openPopup();
        });
        polygon.on("pm:edit", function (e) {
            dispatch(setCoordinates({ ...e.layer.options.indices, newCoords: e.layer.toGeoJSON().geometry.coordinates[0] }));
        });
        polygon.on("pm:remove", function (e) {
            dispatch(setCoordinates({ ...e.layer.options.indices, newCoords: [] }));
        });
    }
    const addPopup = (layer) => {
        //console.log(geojson.features[layer.options.indices.featureIndex].properties)
        var content = document.createElement("textarea");
        content.addEventListener("keyup", function () {
            dispatch(setProperties({ featureIndex: layer.options.indices.featureIndex, text: content.value }));
        });
        layer.on("popupopen", function () {
            content.value = JSON.stringify(geojson.features[layer.options.indices.featureIndex].properties);
            content.focus();
        });
        layer.bindPopup(content).openPopup();
    }

    const mergeRegions = (e) => {
        if (mergePolygon1) {
            mergePolygon2 = e.target;
            //convert to linearRings to call turf.polygon()
            var linearRing1 = [];
            var linearRing2 = [];
            linearRing1.push(getCoordinates(mergePolygon1.options.indices));
            linearRing2.push(getCoordinates(mergePolygon2.options.indices));
            var union = turf.union(turf.polygon(linearRing1), turf.polygon(linearRing2));
            //update on layers
            map.removeLayer(mergePolygon1);
            map.removeLayer(mergePolygon2);
            addFeature(union, geojson.features.length);
            //update geojson object
            dispatch(setNewRegion({ newRegion: union }));
            dispatch(setCoordinates({ ...mergePolygon1.options.indices, newCoords: [] }));
            dispatch(setCoordinates({ ...mergePolygon2.options.indices, newCoords: [] }));

            mergePolygon1 = null;
            mergePolygon2 = null;
        } else {
            mergePolygon1 = e.target;
        }
    }

    const simplifyRegion = (e) => {
        var linearRing = [];
        linearRing.push(getCoordinates(e.target.options.indices));
        var simplified = turf.simplify(turf.polygon(linearRing), {tolerance: 0.01});
        console.log(simplified)
        map.removeLayer(e.target);
        addFeature(simplified, e.target.options.indices.featureIndex);
        dispatch(setCoordinates({ ...e.target.options.indices, newCoords: simplified.geometry.coordinates[0] }));
    }

    return <div>
        <div id="map" style={{ height: '550px' }} />
    </div>

}

export default GeoEditingMap;