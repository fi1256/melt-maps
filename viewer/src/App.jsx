import { useState } from "react";
import Map, { Layer, Popup, Source } from 'react-map-gl/maplibre'
import { ActivityLayer, LAYER_IDS as ACTIVITY_LAYER_IDS, ACTIVITIES } from "./ActivityLayer";
import { LprLayer, LAYER_IDS as LPR_LAYER_IDS } from "./LprLayer";
import 'maplibre-gl/dist/maplibre-gl.css';
import SettingsIcon from './assets/settings.png';
import { ActivityLegend } from "./ActivityLayer/ActivityLegend";
import LegendIcon from './assets/legend.png';

export default function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const [popupFeature, setPopupFeature] = useState(undefined);


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedActivities, setSelectedActivities] = useState(ACTIVITIES);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        initialViewState={{
          longitude: -93.27,
          latitude: 44.98,
          zoom: 8
        }}
        style={{width: "100vw", height: "100vh"}}
        dragRotate={false}
        touchZoomRotate={{ disableRotation: true }}
        scrollZoom={true}
        interactiveLayerIds={[...LPR_LAYER_IDS, ...ACTIVITY_LAYER_IDS]}
        onMouseMove={(e) => {
          const isHovering = e.features && e.features.length > 0;
          e.target.getCanvas().style.cursor = isHovering ? 'pointer' : '';
        }}
        onMouseLeave={(e) => {
          e.target.getCanvas().style.cursor = '';
        }}
        onClick={(e)=>{
          const isHovering = e.features && e.features.length > 0;
          e.target.getCanvas().style.cursor = isHovering ? 'pointer' : '';

          if (isHovering) {         
            setPopupFeature(e.features[0]);  
          }          
        }}
        onLoad={(event)=>{
          const map = event.target

        }}
      >

      <ActivityLayer selectedActivities={selectedActivities} startDate={startDate} endDate={endDate} />

      {!!popupFeature && popupFeature.properties && (
        <Popup 
          longitude={popupFeature.geometry.coordinates[0]} 
          latitude={popupFeature.geometry.coordinates[1]}
          style={{color:'black'}}
          onClose={()=>setPopupFeature(null)}
          >
          <h3 style={{ margin: '0 0 4px', fontSize: '14px' }}>{popupFeature.properties.simplified_activity}</h3>
          <b>Date:</b> {popupFeature.properties.start_datetime_str}<br/>
          <b>Time Start:</b> {popupFeature.properties.start_hour_min}<br/>
          <b>Address:</b> {popupFeature.properties.address}<br/>
          <b>Location Name:</b> {popupFeature.properties.location_type}<br/>
          <b>License Plates:</b> {popupFeature.properties.ice_license_plates}<br/>
          <b>People Taken:</b> {popupFeature.properties.people_taken}<br/>
          <b>Agent Quantity:</b> {popupFeature.properties.agent_qty}<br/>
          <b>Vehicle Quantity:</b> {popupFeature.properties.vehicle_qty}<br/>
          <b>Additional Description:</b> {popupFeature.properties.additional_description}

        </Popup>
      )}

    </Map>


    <div  style={{        
      position: 'absolute',
      margin: 0, padding: 0,
      top: 0,
      right: 0,
      pointerEvents:'all'}}>
      <button id="legendToggle" onClick={()=>setShowLegend(!showLegend)} 
      style={{background:'transparent', border:'none', cursor:'pointer', margin:0, padding:0}}>
        <img src={LegendIcon} alt="Logo" width={44} />;
      </button>
    </div>
    
    {showLegend && (<div id="map-legend-right" >  
      <ActivityLegend selectedActivities={selectedActivities} />
    </div>)}

    <div  style={{        
      position: 'absolute',
      margin: 0, padding: 0,
      top: 0,
      left: 0,
      pointerEvents:'all'}}>
      <button id="settingsToggle" onClick={()=>setShowSettings(!showSettings)} 
      style={{background:'transparent', border:'none', cursor:'pointer', margin:0, padding:0}}>
        <img src={SettingsIcon} alt="Logo" width={44} />;
      </button>
    </div>


    {!!showSettings && <div id="map-legend">

          <div className="filter-section">
            <label className="filter-label">Date Filter</label>
            <div className="date-row">
              <input type="date" id="startDate" onChange={e=>setStartDate(e.target.value)} value={startDate||''}/>
              <input type="date" id="endDate" onChange={e=>setEndDate(e.target.value)} value={endDate||''} />
            </div>
            <div className="preset-row">
              <button id="allDates" onClick={()=>{
                setStartDate(null);
                setEndDate(null);
              }}>All Dates</button>
              <button id="past3Days" onClick={()=>{
                const now = new Date()
                const start = new Date()
                start.setDate(now.getDate() - 3);
                setStartDate(start.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
              }}>Past 3 Days</button>
              <button id="past5Days"onClick={()=>{
                const now = new Date()
                const start = new Date()
                start.setDate(now.getDate() - 5);
                setStartDate(start.toISOString().split("T")[0]);
                setEndDate(now.toISOString().split("T")[0]);
              }}>Past 5 Days</button>
            </div>
          </div>

          {/* <div className="filter-section">
            <label className="filter-label">Time View</label>
            <select id="hourToggle">
              <option value="all">All Hours</option>
              <option value="hourly">Hour slider</option>
            </select>
          </div>

          <div className="filter-section" id="hourSliderContainer">
            <label className="filter-label">Hour of Day</label>
            <div id="hourSlider"></div>
            <div id="hourLabels" className="slider-labels"></div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Display Type</label>
            <select id="displayType">
              <option value="points">Points Only</option>
              <option value="heatmap">Heatmap Only</option>
              <option value="both">Points + Heatmap</option>
            </select>
          </div> */}

          <div className="filter-section">
            <label className="filter-label">Activities <button onClick={()=>setSelectedActivities(ACTIVITIES)}>all</button> <button onClick={()=>setSelectedActivities([])}>none</button></label>
            <div className="checkbox-grid" id="activityToggles">
              {ACTIVITIES.map((activity) => (
                <label key={activity}>
                  <input
                    type="checkbox"
                    value={activity}
                    checked={selectedActivities.includes(activity)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedActivities((prev) => {
                        if (isChecked) {
                          return [...prev, activity];
                        } else {
                          return prev.filter((a) => a !== activity);
                        }
                      });
                    }}
                  />{" "}
                  {activity}
                </label>
              ))}
            </div>
          </div>


      </div>}

      <div id="disclaimer">
        <h3 style={{ margin: 0 }}>
          These data are crowdsourced &lt;3 and do not represent the entirety
          of ICE activity in the area.
        </h3>
        This map is for informational purposes only and its organizers do not
        condone its use to forcibly assault, resist, oppose, impede, or
        interfere with the official duties of any officer or employee of the
        United States or of any agency in any branch of the United States
        Government, while engaged in or on account of the performance of
        official duties.
      </div>
 
    </div>
  );
}
