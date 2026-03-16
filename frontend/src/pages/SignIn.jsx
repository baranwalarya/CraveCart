import react, { useState } from "react"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";



function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const bordercolor = "#ddd";
  const [showPassword,setShowPassword] = useState(false)
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [err,setErr]=useState("")
  const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()

  const handleSignIn  = async () => {
    setLoading(true)
    try{
      const result=await axios.post(`${serverUrl}/api/auth/signin`,{
        email,password
      },{withCredentials:true})
      dispatch(setUserData(result.data))
      navigate("/")
      setErr("")
      setLoading(false)
    }catch(e){
      setErr(e?.response?.data?.message)
      setLoading(false)
    }
  }


  const handleGoogleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const { data } = await axios.post(
      `${serverUrl}/api/auth/google-auth`,
      {
        fullName: user.displayName || "Google User",
        email: user.email,
        mobile: ""
      },
      { withCredentials: true }
    );

    dispatch(setUserData(data))
  } catch (e) {
    console.log(e);
  }
};


  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4" style=
    {{backgroundColor: bgColor}}>
      <div
  className="bg-white rounded-3xl shadow-lg w-full max-w-[340px]
        sm:max-w-[380px] p-6 sm:p-7 border-[1px]"
        style={{ border: `1px solid ${bordercolor}` 
        }}>
        <h1 className={`text-2xl font-bold mb-2`} style={{color:primaryColor}}>CraveCart</h1>
        <p className="text-gray-600 mb-8">Sign In to your account to get started with delicious food</p>

        
        {/* Email */}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
          <input type="email" className="w-full border rounded-lg px-3 py-2 focus:outline-none " placeholder="Enter your email" style={{ border:`1px solid ${bordercolor}`}} onChange={(e)=>setEmail(e.target.value)} value={email} required/>
        </div>

        
        {/* Password */}

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
          <div className="relative">
             <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter your password"
              style={{ border: `1px solid ${bordercolor}` }}
              onChange={(e)=>setPassword(e.target.value)} value={password} required
             />
               <button type="button" className="absolute right-3 cursor-pointer top-[14px] text-gray-500" onClick={() => setShowPassword(prev=>!prev)}>{!showPassword? <FaEye />:<FaEyeSlash />}
               </button>
          </div>
        </div>

       <div className="text-right mb-4 mt-2 text-[#ff4d2d] font-medium cursor-pointer" onClick={()=>navigate("/forgot-password")}>Forgot Password</div>
       
        <button className={`w-full font-semibold rounded-lg  py-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSignIn} disabled={loading}>
          {loading?<ClipLoader size={20} color="white"/> : "Sign In"}
         
        </button>
         {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}

        {/* Google signUp */}

        <button className="w-full mt-4 flex items-center justify-center gap-2 border  rounded-lg px-4 py-2 transition cursor-pointer duration-200 border-gray-400 hover:bg-gray-100" onClick={handleGoogleAuth}>
            <FcGoogle size={20}/>
            <span>Sign in with Google</span>
        </button>
        <p className="text-center mt-6 cursor-pointer" onClick={()=>navigate("/signup")}>Want to create an new account ? <span className="text-[#ff4d2d]">Sign Up</span></p>
      </div> 
    </div>
  )
}

export default SignIn