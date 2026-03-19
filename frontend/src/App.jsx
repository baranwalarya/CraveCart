import React from "react"
import { Routes,Route, Navigate } from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import ForgotPass from "./pages/ForgotPass";
import useGetCurrentUser from "./hooks/useGetCurrentUser.jsx";
import { useSelector } from "react-redux";
import Home from "./pages/Home.jsx";
import useGetLocation from "./hooks/useGetLocation.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import CreateEditShop from "./pages/CreateEditShop.jsx";
import AddItems from "./pages/AddItems.jsx";
import EditItems from "./pages/EditItems.jsx";
import useGetShopByCity from "./hooks/useGetShopByCity.jsx";
import useGetItemByCity from "./hooks/useGetItemByCity.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import OrderPlaced from "./pages/OrderPlaced.jsx";
import MyOrders from "./pages/MyOrders.jsx";


export const serverUrl="https://cravecart-backend-j2vq.onrender.com";

function App() {
  useGetCurrentUser()
  useGetLocation()
  useGetMyShop()
  useGetShopByCity()
  useGetItemByCity()

  const {userData}=useSelector(state=>state.user)
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/> : <Navigate to={"/"}/>} />
      <Route path='/signIn' element={!userData?<SignIn/> : <Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData?<ForgotPass/> : <Navigate to={"/"}/>} />
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>} />
      <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>} />
      <Route path='/add-food' element={userData?<AddItems/>:<Navigate to={"/signin"}/>} />
      <Route path='/edit-food/:itemId' element={userData?<EditItems/>:<Navigate to={"/signin"}/>} />
      <Route path='/cart' element={userData?<CartPage/>:<Navigate to={"/signin"}/>} />
      <Route path='/checkOut' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>} />
      <Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>} />
      <Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>} />

   </Routes>
  )
}

export default App
