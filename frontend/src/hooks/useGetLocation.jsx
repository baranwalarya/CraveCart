import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      dispatch(setLocation({ lat, lon }));

      try {
        const result = await axios.get(
          "https://api.geoapify.com/v1/geocode/reverse",
          {
            params: {
              lat: lat,
              lon: lon,
              format: "json",
              apiKey: apiKey
            },
            withCredentials: false   // ⭐ IMPORTANT FIX
          }
        );

        const location = result?.data?.results?.[0];

        if (!location) return;   // ⭐ crash prevent

        dispatch(setCurrentCity(location.city));
        dispatch(setCurrentState(location.state));

        dispatch(
          setCurrentAddress(
            (location.address_line1 || "") +
            "," +
            (location.address_line2 || "")
          )
        );

        dispatch(setAddress(location.formatted));

      } catch (error) {
        console.log("Geoapify error:", error);
      }

    });
  }, [userData]);
}

export default useGetLocation;