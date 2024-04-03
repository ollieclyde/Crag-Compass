import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface CragMapProps {
  osy: string;
  osx: string;
}

const CragMap: React.FC<CragMapProps> = ({ osy, osx }) => {
  const latitude = parseFloat(osy);
  const longitude = parseFloat(osx);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default CragMap;
