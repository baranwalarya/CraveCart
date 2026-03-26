import express from "express"
import isAuth from "../middlewares/isAuth.js"
import {  getMyOrders, placeOrder, updateOderStatus } from "../controllers/order.controllers.js"


const orderRouter = express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/my-orders",isAuth,getMyOrders)
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOderStatus)

export default orderRouter