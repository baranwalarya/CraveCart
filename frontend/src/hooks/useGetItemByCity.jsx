import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity, setShopsInMyCity, setUserData } from "../redux/userSlice";

function useGetItemByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
    useEffect(()=>{
        if (!currentCity) return;
        const fetchItem = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
                dispatch(setItemsInMyCity(result.data))
                // console.log(result.data)
            } catch (error) {
                console.log(error)
            } 
        }

    fetchItem()  
    },[currentCity])
}

export default useGetItemByCity