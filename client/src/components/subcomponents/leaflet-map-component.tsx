import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from 'react-dom/server';


interface CragMapProps {
  osy: string;
  osx: string;
}

const CragMap: React.FC<CragMapProps> = ({ osy, osx }) => {
  const latitude = parseFloat(osy);
  const longitude = parseFloat(osx);

  const iconMarkup = renderToStaticMarkup(<FaMapMarkerAlt style={{ fontSize: '24px', color: 'red' }} />);
  const customMarkerIcon = L.divIcon({
    html: iconMarkup,
    className: 'my-custom-icon',
    iconSize: L.point(30, 30),
  });

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
      <Marker
        position={[latitude, longitude]}
        icon={customMarkerIcon}
      >
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
