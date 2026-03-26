import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"

export const placeOrder=async (req,res) => {
    try {
        const {cartItems,paymentMethod,deliveryAddress,totalAmount}=req.body
        if( !cartItems || cartItems.length==0 ){
            return res.status(400).json({message:"Cart is empty"})
        }
        if(!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
            return res.status(400).json({message:"Send Complete deliveryAddress"})
        }

        const groupItemByShop={}


        cartItems.forEach(item => {
            const shopId=item.shop
            if(!groupItemByShop[shopId]){
                groupItemByShop[shopId]=[]
            }
            groupItemByShop[shopId].push(item)
        });

        const shopOrders=await Promise.all(Object.keys(groupItemByShop).map(async(shopId)=>{
            const shop=await Shop.findById(shopId).populate("owner")
        //    console.log(shop)
            if(!shop){
                return res.status(400).json({message:"Shop Not Found"})
            }
            const items=groupItemByShop[shopId]
            const subtotal=items.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),0)
            
            return {
                shop:shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems:items.map((i)=>({
                    item:i.id,
                    price:i.price,
                    quantity:i.quantity,
                    name:i.name
                }))
            }
        }))


        const newOrder=await Order.create({
            user:req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        await newOrder.populate("shopOrders.shopOrderItems.item","name image price")
        await newOrder.populate("shopOrders.shop","name")

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({message:`Place order error ${error}`})
    }
}


export const getMyOrders = async (req, res) => {
    try {
        const user=await User.findById(req.userId)
        if(user.role=="user"){
            const orders = await Order.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .populate("shopOrders.shop","name")
            .populate("shopOrders.owner","name email mobile")
            .populate("shopOrders.shopOrderItems.item","name image price")
        return res.status(200).json(orders)
        }else if(user.role=="owner"){
            const orders = await Order.find({ "shopOrders.owner" : req.userId })
            .sort({ createdAt: -1 })
            .populate("shopOrders.shop","name")
            .populate("user")
            .populate("shopOrders.shopOrderItems.item","name image price")

            const filteredOrders=orders.map(order=>({
                _id:order._id,
                paymentMethod:order.paymentMethod,
                user:order.user,
                shopOrders:order.shopOrders.find(o=>o.owner._id==req.userId),
                createdAt:order.createdAt,
                deliveryAddress:order.deliveryAddress
            }))

        return res.status(200).json(filteredOrders)
        }

    } catch (error) {
        return res.status(500).json({ message: `Get user orders error ${error}` }) 
    }
}


export const updateOderStatus=async (req,res) => {
    try {
        const {orderId,shopId}=req.params
        const {status} = req.body
        const order=await Order.findById(orderId)

        const shopOrder= await order.shopOrders.find(o=>o.shop==shopId)
        if(!shopOrder){
            return res.status(400).json({message:"Shop order not found"})
        }
        shopOrder.status=status

        
        await shopOrder.save()
        await order.save()
        return res.status(200).json(shopOrder.status)
    } catch (error) {
       console.error("FULL ERROR:", error.message)
    return res.status(500).json({ message: error.message })
    }
}

