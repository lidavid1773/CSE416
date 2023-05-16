import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setGeojson } from '../features/geojson/geojsonSlice';
import localgeojson from "../maps/ukraine.json";

const shapefile = require('shapefile')
export const FileType = {
    GEOJSON: "GeoJson",
    SHP: "SHP/DBF",
}
export default function UploadFile({ fileType }) {

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const handleClick = () => {
        fileInputRef.current.click();
    };
    const convertToGeojson = (data) => {
        let result = {
            data
        }
        return result;
    }

    const handleShpFile = (e) => {
        var ShpData = null, DbfData = null;
        let length = e.currentTarget.files.length;
        if(length !== 2){
            alert("Please provide one SHP and one DBF")
        }
        
        for (let file of e.currentTarget.files) {
            let reader = new FileReader();
            let ext = getExtension(file.name);
            // eslint-disable-next-line no-loop-func
            reader.onload = () => {
                var geojson = {
                    type: "FeatureCollection",
                    features: []
                }
                if (ext === "dbf") {
                    DbfData = reader.result;
                }
                else if (ext === "shp") {
                    ShpData = reader.result;
                }
                if (ShpData && DbfData) {
                    shapefile.open(ShpData, DbfData).then((source) =>
                        source.read().then(function log(result) {
                            if (result.done) {
                                dispatch(setGeojson(geojson));
                                return;
                            }
                            geojson.features.push(result.value);
                            return source.read().then(log);
                        })
                    ).catch((error) => alert(error.stack));
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }
    const handleGeoJsonFile = (e) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            var geojson = JSON.parse(event.target.result);
            dispatch(setGeojson(geojson));
        }
        reader.readAsText(e.target.files[0]);
    }
    const handleFile = (e) => {
        try {
            fileType === FileType.SHP ? handleShpFile(e) : handleGeoJsonFile(e);
        } catch (error) {
            // Handle the error here
            alert("An error occurred:", error);
        }
    }
    const getExtension = (filename) => {
        var parts = filename.split(".");
        return parts[parts.length - 1];
    }
    return (
        <span>
            <input onChange={handleFile}
                type="file" id="file" accept={fileType === FileType.SHP ? ".shp,.dbf" : ".json"} multiple ref={fileInputRef} style={{ display: 'none' }} />
            <button onClick={handleClick} className="upload-button">{"Upload " + fileType}</button>
        </span>
    );
}