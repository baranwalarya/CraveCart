import express from "express"
import isAuth from "../middlewares/isAuth.js"


const orderRouter = express.Router()

orderRouter.post("/place-order",isAuth,placeOrder)



export default orderRouter