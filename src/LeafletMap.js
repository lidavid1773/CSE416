/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import "leaflet-draw/dist/leaflet.draw-src.css";
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as turf from '@turf/turf'
import localgeojson from "./maps/north_america.json";

function Map() {
  // const [map, setMap] = useState(null);
  const [geojson, setgeojson] = useState(null);
  const mapRef = useRef();

  var map, drawnItems;
  var selectedPolygon = null;
  var isMerging = false;
  var mergePolygon1 = null, mergePolygon2 = null;

  useEffect(() => {
    const fetchData = async () => {
      if (localgeojson) {
        setgeojson(localgeojson);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (geojson) {
      console.log(geojson)
      map = L.map('map', {
        pmIgnore: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

      drawnItems = new L.FeatureGroup();
      geojson.features.forEach((currentFeature, featureIndex) => {
        addFeature(currentFeature, featureIndex, drawnItems);
      });
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
        onClick: e => {
          mergePolygon1 = null;
          mergePolygon2 = null;
          isMerging = !isMerging;
          console.log("merging");
        },
        actions: [
        ]
      }
      map.pm.Toolbar.createCustomControl(mergeOptions);
    }
  }, [geojson]);

  //gets coordinates of polygon in GeoJSON object
  const getCoordinates = ({featureIndex, multiIndex, polyIndex, isMulti}) => {
    if (isMulti)
      return geojson.features[featureIndex].geometry.coordinates[multiIndex][polyIndex];
    else 
      return geojson.features[featureIndex].geometry.coordinates[polyIndex];
  }

  //sets coordinates of polygon in GeoJSON object
  const setCoordinates = ({featureIndex, multiIndex, polyIndex, isMulti}, arr) => {
    if (isMulti)
      geojson.features[featureIndex].geometry.coordinates[multiIndex][polyIndex] = arr;
    else 
      geojson.features[featureIndex].geometry.coordinates[polyIndex] = arr;
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
    var polygon = L.polygon(L.GeoJSON.coordsToLatLngs(poly)).addTo(map);
    // polygon.options.index = 1;
    polygon.options.indices = {featureIndex, multiIndex, polyIndex, isMulti};
    // if (isMulti)
    //   console.log(geojson.features[featureIndex].geometry.coordinates[multiIndex][polyIndex]);
    // else
    //   console.log(geojson.features[featureIndex].geometry.coordinates[polyIndex]);

    drawnItems.addLayer(polygon);
    polygon.on('click', function (e) {
      if (selectedPolygon) 
        selectedPolygon.pm.disable();
      if (isMerging) {
        mergeRegions(e);
      }
      selectedPolygon = e.target;
      e.target.pm.enable({
        allowSelfIntersection: false,
      });
      //applyNewStyle(polygon, e)
    });
  }

  const mergeRegions = (e) => {
    if (mergePolygon1) {
      mergePolygon2 = e.target;
      var linearRing1 = [];
      var linearRing2 = [];
      linearRing1.push(getCoordinates(mergePolygon1.options.indices));
      linearRing2.push(getCoordinates(mergePolygon2.options.indices));
      var union = turf.union(turf.polygon(linearRing1), turf.polygon(linearRing2));
      map.removeLayer(mergePolygon1);
      map.removeLayer(mergePolygon2);

      addFeature(union, geojson.features.length, drawnItems);
      geojson.features.push(union);
      setCoordinates(mergePolygon1.options.indices, []);
      setCoordinates(mergePolygon2.options.indices, []);
      console.log(geojson);

      mergePolygon1 = null;
      mergePolygon2 = null;
    } else {
      mergePolygon1 = e.target;
    }
  }
  return <div>
          <div id="map" style={{ height: '600px' }} />
        </div>

}

export default Map;
