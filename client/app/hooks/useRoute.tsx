import { useEffect, useState } from "react";
import { LatLng, latLng } from "leaflet";
import axios from "axios";
import polyline from "@mapbox/polyline";

const useRoute = (
  pickupPosition: LatLng | null,
  dropoffPosition: LatLng | null
) => {
  const [route, setRoute] = useState<LatLng[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupPosition || !dropoffPosition) return;

      try {
        const start = `${pickupPosition.lng},${pickupPosition.lat}`;
        const end = `${dropoffPosition.lng},${dropoffPosition.lat}`;

        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=polyline`
        );

        if (!response.data.routes?.length) {
          console.error("No routes found in response");
          return;
        }

        const routeData = response.data.routes[0].geometry;
        if (!routeData) {
          console.error("No geometry found in route");
          return;
        }

        const decoded = polyline.decode(routeData);
        const routePoints = decoded.map(([lat, lng]: number[]) =>
          latLng(lat, lng)
        );

        setRoute(routePoints);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("OSRM API Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        } else {
          console.error("Error fetching route:", error);
        }
      }
    };

    fetchRoute();
  }, [pickupPosition, dropoffPosition]);

  return route;
};

export default useRoute;
