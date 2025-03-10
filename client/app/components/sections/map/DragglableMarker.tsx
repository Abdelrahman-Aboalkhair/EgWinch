import { Marker } from "react-leaflet";
import { LatLng, LeafletEvent, latLng } from "leaflet";
import fetchAddress from "@/app/utils/fetchAddress";

interface DraggableMarkerProps {
  position: LatLng;
  isPickup: boolean;
  setPosition: (pos: LatLng) => void;
  onSetPosition: (pos: LatLng) => void;
  setAddress: (address: string) => void;
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({
  position,
  setPosition,
  onSetPosition,
  setAddress,
}) => {
  const handleMarkerDragEnd = async (e: LeafletEvent) => {
    const { lat, lng } = (e.target as any).getLatLng();
    const address = await fetchAddress(lat, lng);
    const newPosition = latLng(lat, lng);

    setPosition(newPosition);
    onSetPosition(newPosition);
    setAddress(address);
  };

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{ dragend: handleMarkerDragEnd }}
    />
  );
};

export default DraggableMarker;
