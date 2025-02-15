"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { latLng, LatLng, LeafletEvent } from "leaflet";
import axios from "axios";
import L from "leaflet";
import polyline from "@mapbox/polyline";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the marker icon path
delete L.Icon.Default.prototype._getIconUrl;

// Set a new default marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapProps {
  pickup?: string;
  dropoff?: string;
  onSetPickup: (pickup: LatLng) => void;
  onSetDropoff: (dropoff: LatLng) => void;
  setPickup: (pickup: string) => void;
  setDropoff: (dropoff: string) => void;
  setRouteDistance: (distance: number) => void;
  setRouteDuration: (duration: number) => void;
}

const Map: React.FC<MapProps> = ({
  pickup,
  dropoff,
  onSetPickup,
  onSetDropoff,
  setPickup,
  setDropoff,
  setRouteDistance,
  setRouteDuration,
}) => {
  const [pickupPosition, setPickupPosition] = useState<LatLng | null>(null);
  const [dropoffPosition, setDropoffPosition] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);

  // Transform raw address to lat and lon
  useEffect(() => {
    if (pickup) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${pickup}`
        )
        .then((response) => {
          const { lat, lon } = response.data[0];
          setPickupPosition(latLng(lat, lon));
        });
    }
  }, [pickup]);

  useEffect(() => {
    if (dropoff) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${dropoff}`
        )
        .then((response) => {
          const { lat, lon } = response.data[0];
          setDropoffPosition(latLng(lat, lon));
        });
    }
  }, [dropoff]);

  useEffect(() => {
    if (pickupPosition && dropoffPosition) {
      const start = `${pickupPosition?.lng},${pickupPosition?.lat}`;
      const end = `${dropoffPosition?.lng},${dropoffPosition?.lat}`;

      axios
        .get(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full`
        )
        .then((res) => {
          console.log("res.data: ", res.data);
          const route = res.data.routes[0]?.geometry;
          const routeDuration = res.data.routes[0]?.duration;
          setRouteDuration(routeDuration / 60);

          if (route) {
            const decoded = polyline.decode(route);

            const polylinePoints = decoded.map(([lat, lng]: number[]) =>
              latLng(lat, lng)
            );

            setRoute(polylinePoints);
            setRouteDistance(res.data.routes[0].distance / 1000);
          } else {
            console.warn("No valid route found.");
          }
        })
        .catch((err) => console.error("OSRM Route Error:", err));
    }
  }, [pickupPosition, dropoffPosition]);

  const handleMapClick = async (e: LeafletEvent) => {
    const { lat, lng } = e.latlng;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const address = response.data.display_name;
      console.log("address:", address);

      if (!pickupPosition) {
        const newPickup = latLng(lat, lng);
        setPickupPosition(newPickup);
        onSetPickup(newPickup);
        setPickup(address);
      } else {
        const newDropoff = latLng(lat, lng);
        setDropoffPosition(newDropoff);
        onSetDropoff(newDropoff);
        setDropoff(address);
      }
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  };

  const handleMarkerDragEnd = async (e: LeafletEvent, isPickup: boolean) => {
    const { lat, lng } = e.target.getLatLng();

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const address = response.data.display_name;
    console.log("address:", address);

    const newPosition = latLng(lat, lng);
    if (isPickup) {
      setPickupPosition(newPosition);
      onSetPickup(newPosition); // Update parent component's state

      setPickup(address); // Populate the input with the address
    } else {
      setDropoffPosition(newPosition);
      onSetDropoff(newPosition); // Update parent component's state
      setDropoff(address);
    }
  };

  const MapEvents = () => {
    const map = useMap();
    useEffect(() => {
      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
      };
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={[30.0444, 31.2357]}
      zoom={12}
      className="rounded-md h-[550px] w-[57%] focus:border-none focus:outline-none foucs:ring-2 focus:ring-primary"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />

      {pickupPosition && (
        <Marker
          position={pickupPosition}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(e, true),
          }}
        >
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {dropoffPosition && (
        <Marker
          position={dropoffPosition}
          draggable={true}
          eventHandlers={{
            dragend: (e) => handleMarkerDragEnd(e, false),
          }}
        >
          <Popup>Dropoff Location</Popup>
        </Marker>
      )}

      {route.length > 1 && (
        <Polyline positions={route} color="blue" weight={6} opacity={1} />
      )}
    </MapContainer>
  );
};

export default Map;
