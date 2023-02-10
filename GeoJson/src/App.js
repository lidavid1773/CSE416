import logo from './logo.svg';
import './App.css';
import MyMap from './Components/MyMap';
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
      document.getElementById('GeoJson').addEventListener('change', onChange);
  
  }());
  }

  return (
    <div className="App">
      <header className="App-header">

      <div>
        <input style={style} type="file" id="GeoJson" accept="application/JSON" onInput={onInput} required/>
      </div>

      <br/>
      {/* {
        show && (<input id = 'changename' style={{width:'30%'}} value={regionname} onInput={e => setName(e.target.value)} placeholder='Change region name here and press enter!' 
                onKeyDown={e => {
                  if(e.key === 'Enter'){
                    setDone(true);
                  }
                }}
        />)
      } */}
      <br/>

      <MyMap geodata = {geodata} setGeodata = {setGeodata}></MyMap>
      

      </header>
    </div>
  );
}

export default App;
