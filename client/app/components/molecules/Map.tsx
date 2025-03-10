"use client";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { LatLng } from "leaflet";
import useRoute from "@/app/hooks/useRoute";
import MapInteractions from "@/app/components/sections/map/MapInteractions";
import DraggableMarker from "@/app/components/sections/map/DragglableMarker";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
  address: string;
}

interface MapProps {
  pickup: GeoJSONPoint | null;
  dropoff: GeoJSONPoint | null;
  onSetPickup: (pickup: LatLng) => void;
  onSetDropoff: (dropoff: LatLng) => void;
  setPickupAddress: (address: string) => void;
  setDropoffAddress: (address: string) => void;
}

const Map: React.FC<MapProps> = ({
  onSetPickup,
  onSetDropoff,
  setPickupAddress,
  setDropoffAddress,
}) => {
  const [pickupPosition, setPickupPosition] = useState<LatLng | null>(null);
  const [dropoffPosition, setDropoffPosition] = useState<LatLng | null>(null);

  const route = useRoute(pickupPosition, dropoffPosition);

  return (
    <MapContainer
      key={JSON.stringify(pickupPosition) + JSON.stringify(dropoffPosition)}
      center={[30.0444, 31.2357]}
      zoom={12}
      className="rounded-md h-[480px] w-1/2"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapInteractions
        pickupPosition={pickupPosition}
        setPickupPosition={setPickupPosition}
        setDropoffPosition={setDropoffPosition}
        onSetPickup={onSetPickup}
        onSetDropoff={onSetDropoff}
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
      />

      {pickupPosition && (
        <DraggableMarker
          position={pickupPosition}
          setPosition={setPickupPosition}
          onSetPosition={onSetPickup}
          setAddress={setPickupAddress}
          isPickup={true}
        />
      )}

      {dropoffPosition && (
        <DraggableMarker
          position={dropoffPosition}
          setPosition={setDropoffPosition}
          onSetPosition={onSetDropoff}
          setAddress={setDropoffAddress}
          isPickup={false}
        />
      )}

      {route.length > 1 && (
        <Polyline positions={route} color="blue" weight={6} opacity={1} />
      )}
    </MapContainer>
  );
};

export default Map;
