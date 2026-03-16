import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetLocation() {
    const dispatch=useDispatch()
    const {userData} = useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async (position)=>{
        const lat=position.coords.latitude
        const lon=position.coords.longitude
        dispatch(setLocation({lat:lat,lon:lon}))
        const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`)
        dispatch(setCurrentCity(result?.data?.results[0].city))
        dispatch(setCurrentState(result?.data?.results[0].state))
        dispatch(setCurrentAddress(result?.data?.results[0].address_line1 + ","
        + result?.data?.results[0].address_line2))
        dispatch(setAddress(result?.data?.results[0].formatted))
    })
  },[userData])
}

export default useGetLocation