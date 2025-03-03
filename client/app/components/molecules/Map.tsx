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
  setPickup: (pickup: GeoJSONPoint | null) => void;
  setDropoff: (dropoff: GeoJSONPoint | null) => void;
  setPickupAddress: (address: string) => void;
  setDropoffAddress: (address: string) => void;
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
  setPickupAddress,
  setDropoffAddress,
}) => {
  const [pickupPosition, setPickupPosition] = useState<LatLng | null>(null);
  const [dropoffPosition, setDropoffPosition] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);

  // Convert GeoJSON to LatLng when props change
  useEffect(() => {
    if (pickup) {
      setPickupPosition(latLng(pickup.coordinates[1], pickup.coordinates[0]));
    }
    if (dropoff) {
      setDropoffPosition(
        latLng(dropoff.coordinates[1], dropoff.coordinates[0])
      );
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    if (pickupPosition && dropoffPosition) {
      const start = `${pickupPosition?.lng},${pickupPosition?.lat}`;
      const end = `${dropoffPosition?.lng},${dropoffPosition?.lat}`;

      axios
        .get(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full`
        )
        .then((res) => {
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

      if (!pickupPosition) {
        const newPickup = latLng(lat, lng);
        setPickupPosition(newPickup);
        onSetPickup(newPickup);
        setPickupAddress(address);
        setPickup({
          type: "Point",
          coordinates: [lng, lat],
          address: address,
        });
      } else {
        const newDropoff = latLng(lat, lng);
        setDropoffPosition(newDropoff);
        onSetDropoff(newDropoff);
        setDropoffAddress(address);
        setDropoff({
          type: "Point",
          coordinates: [lng, lat],
          address: address,
        });
      }
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  };

  const handleMarkerDragEnd = async (e: LeafletEvent, isPickup: boolean) => {
    const { lat, lng } = e.target.getLatLng();

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const address = response.data.display_name;
      const newPosition = latLng(lat, lng);

      if (isPickup) {
        setPickupPosition(newPosition);
        onSetPickup(newPosition);
        setPickupAddress(address);
        setPickup({
          type: "Point",
          coordinates: [lng, lat],
          address: address,
        });
      } else {
        setDropoffPosition(newPosition);
        onSetDropoff(newPosition);
        setDropoffAddress(address);
        setDropoff({
          type: "Point",
          coordinates: [lng, lat],
          address: address,
        });
      }
    } catch (error) {
      console.error("Failed to get address:", error);
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
      className="rounded-md h-[530px] w-1/2 focus:border-none focus:outline-none foucs:ring-2 focus:ring-primary"
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
