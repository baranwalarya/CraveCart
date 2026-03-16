



const orderRouter = express.Router()

orderRouter.post("/create-edit",isAuth,upload.single("image"),create_EditShop)



export default orderRouter