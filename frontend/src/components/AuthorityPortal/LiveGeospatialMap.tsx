import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Layers, Eye, Wind, Flame, School, Building2, AlertTriangle, Play, MapPin, Locate, Compass } from 'lucide-react';
import { Hotspot, InfrastructureItem } from '../../types';

interface LiveGeospatialMapProps {
  city: string;
  hotspots: Hotspot[];
  infrastructure: InfrastructureItem[];
  selectedHotspot: Hotspot | null;
  onSelectHotspot: (hotspot: Hotspot) => void;
}

export const LiveGeospatialMap: React.FC<LiveGeospatialMapProps> = ({
  city,
  hotspots,
  infrastructure,
  selectedHotspot,
  onSelectHotspot
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [showAQI, setShowAQI] = useState(true);
  const [showPropagation, setShowPropagation] = useState(true);
  const [showCitizenReports, setShowCitizenReports] = useState(true);
  const [showSatellite, setShowSatellite] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showIndustrial, setShowIndustrial] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [usingFallbackTiles, setUsingFallbackTiles] = useState(false);

  // Center coordinates by city
  const cityCoords: Record<string, [number, number]> = {
    Hyderabad: [78.4867, 17.3850],
    Bengaluru: [77.5946, 12.9716],
    Chennai: [80.2707, 13.0827],
    Delhi: [77.2090, 28.6139],
    Mumbai: [72.8777, 19.0760]
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const coords = cityCoords[city] || cityCoords["Hyderabad"];

    // Free fallback style using OpenStreetMap tiles (no API key needed)
    const osmFallbackStyle = {
      version: 8 as const,
      sources: {
        'osm-tiles': {
          type: 'raster' as const,
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      },
      layers: [
        {
          id: 'osm-tiles-layer',
          type: 'raster' as const,
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    };

    const addMapContent = (map: maplibregl.Map) => {
      // Add Hotspots layer
      hotspots.forEach(h => {
        const el = document.createElement('div');
        el.className = 'hotspot-marker cursor-pointer flex items-center justify-center';
        el.innerHTML = `
          <div class="relative">
            <div class="w-8 h-8 rounded-full bg-red-500/30 animate-ping absolute -inset-1"></div>
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-orange-600 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-lg">
              ${h.severity === 'CRITICAL' ? '!' : 'H'}
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          onSelectHotspot(h);
        });

        new maplibregl.Marker({ element: el })
          .setLngLat([h.longitude, h.latitude])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 text-slate-900">
              <strong class="text-sm">${h.title}</strong><br/>
              <span class="text-xs">PM2.5: ${h.current_pm25} µg/m³ (AQI ${h.current_aqi})</span><br/>
              <span class="text-[11px] text-red-600 font-semibold">${h.probable_source}</span>
            </div>
          `))
          .addTo(map);
      });

      // Add Infrastructure Markers (Schools, Hospitals, Industrial)
      infrastructure.forEach(item => {
        const el = document.createElement('div');
        el.className = 'infra-marker text-xs font-bold';
        if (item.category === 'SCHOOL') {
          el.innerHTML = `<span class="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] shadow">🏫</span>`;
        } else if (item.category === 'HOSPITAL') {
          el.innerHTML = `<span class="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] shadow">🏥</span>`;
        } else {
          el.innerHTML = `<span class="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] shadow">🏭</span>`;
        }

        new maplibregl.Marker({ element: el })
          .setLngLat([item.longitude, item.latitude])
          .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`
            <div class="p-1.5 text-slate-900 text-xs">
              <strong>${item.name}</strong> (${item.category})
            </div>
          `))
          .addTo(map);
      });

      // Add Propagation Vector Cone Polygon (+3h horizon)
      map.addSource('propagation-cone', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [78.3489, 17.4401],
              [78.3320, 17.4150],
              [78.3650, 17.4080],
              [78.3489, 17.4401]
            ]]
          }
        }
      });

      map.addLayer({
        id: 'propagation-fill',
        type: 'fill',
        source: 'propagation-cone',
        layout: {},
        paint: {
          'fill-color': '#f97316',
          'fill-opacity': 0.35
        }
      });

      map.addLayer({
        id: 'propagation-outline',
        type: 'line',
        source: 'propagation-cone',
        layout: {},
        paint: {
          'line-color': '#ea580c',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });
    };

    // Try MapTiler first, fall back to CartoDB on auth failure
    const mapTilerKey = 'e0wDZ3j2iKg9WfGGyqBT';
    const mapTilerStyleUrl = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${mapTilerKey}`;

    let currentMap: maplibregl.Map | null = null;

    const initMapWithStyle = (style: any) => {
      if (!mapContainerRef.current) return;
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        center: coords,
        zoom: 12
      });
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      mapRef.current = map;
      currentMap = map;
      map.on('load', () => addMapContent(map));
    };

    // Validate MapTiler key first; if it fails, use CartoDB fallback
    fetch(mapTilerStyleUrl)
      .then(res => {
        if (res.ok) {
          console.log('[AERIS Map] MapTiler key valid, using MapTiler tiles');
          initMapWithStyle(mapTilerStyleUrl);
        } else {
          console.warn(`[AERIS Map] MapTiler returned ${res.status}, falling back to OpenStreetMap tiles`);
          setUsingFallbackTiles(true);
          initMapWithStyle(osmFallbackStyle);
        }
      })
      .catch(err => {
        console.warn('[AERIS Map] MapTiler unreachable, falling back to OpenStreetMap tiles', err);
        setUsingFallbackTiles(true);
        initMapWithStyle(osmFallbackStyle);
      });

    return () => {
      if (currentMap) currentMap.remove();
    };
  }, [city, hotspots, infrastructure]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            speed: 1.2
          });

          // Add or update pulsing GPS marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLngLat([longitude, latitude]);
          } else {
            const el = document.createElement('div');
            el.className = 'user-gps-marker relative flex items-center justify-center';
            el.innerHTML = `
              <div class="relative flex items-center justify-center">
                <div class="w-10 h-10 rounded-full bg-sky-500/40 animate-ping absolute"></div>
                <div class="w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-xl flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
            `;
            userMarkerRef.current = new maplibregl.Marker({ element: el })
              .setLngLat([longitude, latitude])
              .setPopup(new maplibregl.Popup({ offset: 15 }).setHTML(`
                <div class="p-2 text-slate-900 font-bold text-xs">
                  <span class="text-sky-600">🎯 YOUR LIVE LOCATION</span><br/>
                  <span class="text-[11px] font-normal text-slate-600">Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}</span>
                </div>
              `))
              .addTo(mapRef.current);
          }
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Could not fetch your GPS location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-command-border shadow-2xl">

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={usingFallbackTiles ? { filter: 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.1)' } : undefined} />

      {/* GPS Locate Me Button Overlay */}
      <button
        onClick={handleLocateMe}
        disabled={isLocating}
        className="absolute top-4 right-14 bg-navy-900/90 hover:bg-slate-800 border border-sky-500/50 backdrop-blur-md text-sky-400 font-semibold px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 text-xs transition z-10"
        title="Zoom to Live GPS Location"
      >
        <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-amber-400' : 'text-sky-400'}`} />
        <span>{isLocating ? 'Acquiring GPS...' : 'Locate Me'}</span>
      </button>

      {/* Map Layer Controls Overlay */}
      <div className="absolute top-4 left-4 bg-navy-900/90 border border-command-border backdrop-blur-md p-3.5 rounded-xl shadow-xl space-y-2 text-xs w-64 z-10">
        <div className="flex items-center space-x-2 text-sky-400 font-bold border-b border-slate-800 pb-2 mb-2">
          <Layers className="w-4 h-4" />
          <span>GEOSPATIAL MAP LAYERS</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
            <input type="checkbox" checked={showAQI} onChange={e => setShowAQI(e.target.checked)} className="rounded text-sky-500" />
            <span>AQI & PM2.5 Interpolation</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-amber-400 font-semibold">
            <input type="checkbox" checked={showPropagation} onChange={e => setShowPropagation(e.target.checked)} className="rounded text-amber-500" />
            <span>Pollution Propagation Vector (+3h)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
            <input type="checkbox" checked={showSatellite} onChange={e => setShowSatellite(e.target.checked)} className="rounded text-sky-500" />
            <span>Sentinel-5P NO2 / MODIS Fire Anomaly</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
            <input type="checkbox" checked={showCitizenReports} onChange={e => setShowCitizenReports(e.target.checked)} className="rounded text-sky-500" />
            <span>Citizen Report Clusters (286)</span>
          </label>

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <label className="flex items-center space-x-2 cursor-pointer text-blue-400">
              <input type="checkbox" checked={showSchools} onChange={e => setShowSchools(e.target.checked)} className="rounded text-blue-500" />
              <span>Schools (21 affected)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-emerald-400">
              <input type="checkbox" checked={showHospitals} onChange={e => setShowHospitals(e.target.checked)} className="rounded text-emerald-500" />
              <span>Hospitals (6 affected)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-amber-400">
              <input type="checkbox" checked={showIndustrial} onChange={e => setShowIndustrial(e.target.checked)} className="rounded text-amber-500" />
              <span>Industrial Facilities (12)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-navy-900/90 border border-command-border backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-4 text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span className="text-slate-300">Critical Hotspot</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 bg-amber-500/40 border border-amber-500"></span>
          <span className="text-slate-300">Propagation Zone (+3h)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-xs">🏫</span>
          <span className="text-slate-300">School</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-xs">🏥</span>
          <span className="text-slate-300">Hospital</span>
        </div>
      </div>

    </div>
  );
};
