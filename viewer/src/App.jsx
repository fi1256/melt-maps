import { useState } from "react";
import Map, { MapProvider, Popup } from 'react-map-gl/maplibre'
import { ActivityLayer, LAYER_IDS as ACTIVITY_LAYER_IDS, ACTIVITIES } from "./ActivityLayer";
import { LAYER_IDS as LPR_LAYER_IDS } from "./LprLayer";
import 'maplibre-gl/dist/maplibre-gl.css';
import SettingsIcon from './assets/settings.png';
import { ActivityLegend } from "./ActivityLayer/ActivityLegend";
import LegendIcon from './assets/legend.png';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { SnapshotButton } from "./SnapshotButton";
import { useActivityData } from "./ActivityLayer/useActivityData";

export default function App() {

  const [showSettings, setShowSettings] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [activityDisplayType, setActivityDisplayType] = useState('points');

  const [popupFeature, setPopupFeature] = useState(undefined);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [hoursRange, setHoursRange] = useState([0,23]);

  const [selectedActivities, setSelectedActivities] = useState(ACTIVITIES);

  const activityData = useActivityData()
 
  return (
    <MapProvider>

    <div style={{ position: 'relative', width: '100%', height: '100vh' }} id="container">
      <Map
        id="activity"
        preserveDrawingBuffer={true}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        initialViewState={{
          longitude: -93.27,
          latitude: 44.98,
          zoom: 9.5
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

        maxBounds={[
          [ -101.28423864235761,42.94048660448547],
          [ -84.53595903629167,46.63502927592219]
        ]}
      >

      <ActivityLayer 
        selectedActivities={selectedActivities}
        startDate={startDate} endDate={endDate} hoursRange={hoursRange} 
        displayType={activityDisplayType}
      />

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
        <img src={LegendIcon} alt="Logo" width={44} />
      </button>

      <br/>

      <SnapshotButton />
    </div>

    
    {showLegend && (<div id="map-legend-right" >  
      <ActivityLegend selectedActivities={selectedActivities} />
    </div>)}

    <div style={{        
      position: 'absolute',
      margin: 0, padding: 0,
      top: 0,
      left: 0,
      pointerEvents:'all', verticalAlign:'top'}}>
      <button id="settingsToggle" onClick={()=>setShowSettings(!showSettings)} 
      style={{background:'transparent', border:'none', cursor:'pointer', margin:0, padding:0}}>
        <img src={SettingsIcon} alt="Logo" width={44} />
      </button>

      <span style={{position: 'absolute', top: 0, left: 48, color:'black', fontSize:12, backgroundColor:'white', fontStyle: 'italic', whiteSpace: 'nowrap'}}>
        updated {activityData.data?.updated ? new Date(activityData.data.updated).toLocaleString() : ''}
      </span>
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

          <div className="filter-section">
            <label className="filter-label">Hours {Math.round(hoursRange[0])} - {Math.round(hoursRange[1])}</label>
               
            <Nouislider range={{ min: 0, max: 23 }} start={hoursRange} connect step={1} onUpdate={e=>setHoursRange(e)}/>

          </div>

          <div className="filter-section">
            <label className="filter-label">Activities
              <button style={{padding:5}} onClick={()=>setSelectedActivities(ACTIVITIES)}>all</button>
              <button style={{padding:5}} onClick={()=>setSelectedActivities([])}>none</button>

              <select id="displayType" onChange={e=>setActivityDisplayType(e.target.value)} value={activityDisplayType}>
                <option value="points">Points Only</option>
                <option value="heatmap">Heatmap Only</option>
                <option value="both">Points + Heatmap</option>
              </select>
            </label>
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
        </MapProvider>

  );
}
