import logo from './logo.svg';
import './App.css';
import MyMap from './Components/MyMap';
import NewMap from './Components/NewMap';
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

function App() {

  const [geodata, setGeodata] = useState(null);

  var style = {
    backgroundColor:'white',
    alignItem: 'center',
    margin:'auto',
    padding:'auto'
  };

  const onInput = (event) => {
    (function(){
    
      function onChange(event) {
          var reader = new FileReader();
          reader.onload = onReaderLoad;
          reader.readAsText(event.target.files[0]);
      }
  
      function onReaderLoad(event){
          var obj = JSON.parse(event.target.result);
          setGeodata(obj);
          document.querySelector(".infos").innerHTML=`name:${obj.Userinfo.name}interest: ${obj.Userinfo.interest}`
      
   }
      document.getElementById('file').addEventListener('change', onChange);
  
  }());
  }

  return (
    <div className="App">
      <header className="App-header">

      <div>
        <input style={style} type="file" id="file" accept="application/JSON" onInput={onInput} required/>
      </div>

      <br/>
      <br/>

      <MyMap geodata = {geodata}></MyMap>
      

      </header>
    </div>
  );
}

export default App;
