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
import { setCoordinates, setNewRegion } from '../features/geojson/geojsonSlice';
// import localgeojson from "../maps/north_america.json";

function GeoEditingMap() {
    const dispatch = useDispatch();
    const mapRef = useRef();
    const geojsonController = useSelector((state) => state.geojsonController);
    const { geojson } = geojsonController;
    const [map, setMap] = useState(null);
    const [first, setFirst] = useState(true);
    // const [isMerging, setIsMerging] = useState(false);

    var drawnItems;
    var isMerging = false;
    var selectedPolygon = null;
    var mergePolygon1 = null, mergePolygon2 = null;


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
        if (geojson && first) {
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
                block: "edit",
                title: "Merge Regions",
                className: "leaflet-pm-icon-polyline",
                onClick: () => {
                    mergePolygon1 = null;
                    mergePolygon2 = null;
                    isMerging = !isMerging;
                },
                actions: [
                ]
            }
            map.pm.Toolbar.createCustomControl(mergeOptions);

            map.fitBounds(L.geoJson(geojson).getBounds());
            map.addLayer(drawnItems);

            map.on("pm:create", function (e) {
                drawnItems.addLayer(e.layer);
                e.layer.on('click', function (e) {
                    if (selectedPolygon)
                        selectedPolygon.pm.disable();
                    selectedPolygon = e.target;
                    e.target.pm.enable({
                        allowSelfIntersection: false,
                    });
                });
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

        drawnItems.addLayer(polygon);
        polygon.on('click', function (e) {
            if (selectedPolygon) {
                //return to original color
                selectedPolygon.setStyle({fillColor: "#3388ff"});
                selectedPolygon.pm.disable();
            }
            if (isMerging) {
                mergeRegions(e);
            }
            selectedPolygon = e.target;
            selectedPolygon.setStyle({fillColor: "red"});
            e.target.pm.enable({
                allowSelfIntersection: false,
            });
        });
        polygon.on("pm:edit", function (e) {
            dispatch(setCoordinates({ ...e.layer.options.indices, newCoords: e.layer.toGeoJSON().geometry.coordinates[0] }));
        });
        polygon.on("pm:remove", function (e) {
            dispatch(setCoordinates({ ...e.layer.options.indices, newCoords: [] }));
        });
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
            addFeature(union, geojson.features.length, drawnItems);
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

    return <div>
        <div id="map" style={{ height: '550px' }} />
    </div>

}

export default GeoEditingMap;