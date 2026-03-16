import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"

export const placeOrder=async (req,res) => {
    try {
        const {cartItems,paymentMethod,deliveryAddress,totalAmount}=req.body
        if(cartItems.length==0 || !cartItems){
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

        const shopOrders=await Object.keys(groupItemByShop).map(async(shopId)=>{
            const shop=await Shop.findById(shopId).populate("owner")
            if(!shop){
                return res.status(400).json({message:"Shop Not Found"})
            }
            const items=groupItemByShop[shopId]
            const subtotal=items.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),0)
            return {
                shop:shop._id,
                owner:shop.owner._id,
                subtotal,
                shopOrderItems:items.map((i)=>({
                    item:i._id,
                    price:i.price,
                    quantity:i.quantity,
                    name:i.name
                }))
            }
        })

        const newOrder=await Order.create({
            user:req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        return res.status(201).json(newOrder)

    } catch (error) {
        return res.status(500).json({message:`Place order error ${error}`})
    }
}


