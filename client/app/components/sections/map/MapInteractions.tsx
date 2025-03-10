import { useEffect } from "react";
import { LatLng, LeafletEvent, latLng } from "leaflet";
import { useMap } from "react-leaflet";
import fetchAddress from "@/app/utils/fetchAddress";

interface MapInteractionsProps {
  pickupPosition: LatLng | null;
  setPickupPosition: (pos: LatLng) => void;
  setDropoffPosition: (pos: LatLng) => void;
  onSetPickup: (pos: LatLng) => void;
  onSetDropoff: (pos: LatLng) => void;
  setPickupAddress: (address: string) => void;
  setDropoffAddress: (address: string) => void;
}

const MapInteractions: React.FC<MapInteractionsProps> = ({
  pickupPosition,
  setPickupPosition,
  setDropoffPosition,
  onSetPickup,
  onSetDropoff,
  setPickupAddress,
  setDropoffAddress,
}) => {
  const map = useMap();

  useEffect(() => {
    const handleMapClick = async (e: LeafletEvent) => {
      const { lat, lng } = e.latlng;
      const address = await fetchAddress(lat, lng);
      const newPosition = latLng(lat, lng);

      if (!pickupPosition) {
        setPickupPosition(newPosition);
        onSetPickup(newPosition);
        setPickupAddress(address);
      } else {
        setDropoffPosition(newPosition);
        onSetDropoff(newPosition);
        setDropoffAddress(address);
      }
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [
    map,
    pickupPosition,
    setPickupPosition,
    setDropoffPosition,
    onSetPickup,
    onSetDropoff,
    setPickupAddress,
    setDropoffAddress,
  ]);

  return null;
};

export default MapInteractions;
