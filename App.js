import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

function App() {
  const [medicine, setMedicine] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [userLoc, setUserLoc] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const handleGetDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleSearch = () => {
    const medicineList = ["Dolo 650", "Insulin", "Ecosprin", "Metformin", "Azithromycin"];
    const shopNames = ["Apollo", "MedPlus", "Wellness Forever", "Trust Chemist", "Noble Plus"];
    const tempDatabase = [];

    for (let i = 0; i < 60; i++) {
      const itemLat = 12.90 + (Math.random() * 0.15);
      const itemLng = 77.50 + (Math.random() * 0.20);
      const dist = calculateDistance(userLoc.lat, userLoc.lng, itemLat, itemLng);

      tempDatabase.push({
        id: i,
        name: `${shopNames[i % 5]} - Branch ${i + 101}`,
        med: medicineList[i % 5],
        lat: itemLat,
        lng: itemLng,
        distance: dist
      });
    }

    const filtered = tempDatabase.filter(item => 
      item.med.toLowerCase().includes(medicine.toLowerCase())
    );
    setPharmacies(filtered);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#e74c3c', textAlign: 'center' }}>🚑 MedQuick SOS</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input 
          placeholder="Search (e.g. Insulin)..." 
          onChange={(e) => setMedicine(e.target.value)}
          style={{ padding: '12px', width: '300px', borderRadius: '5px 0 0 5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSearch} style={{ padding: '12px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer' }}>
          SEARCH
        </button>
      </div>

      <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={13} style={{ height: "550px", width: "100%", borderRadius: "15px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={[userLoc.lat, userLoc.lng]} icon={L.divIcon({
            className: 'user-icon',
            html: "<div style='background-color:#3498db; width:15px; height:15px; border-radius:50%; border:2px solid white;'></div>"
        })}>
          <Popup>Your Location</Popup>
        </Marker>

        {pharmacies.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h3>{p.name}</h3>
                <p><b>{p.distance} km away</b></p>
                <button onClick={() => handleGetDirections(p.lat, p.lng)} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px', borderRadius: '5px', width: '100%' }}>
                  🚀 GET DIRECTIONS
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;