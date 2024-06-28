import { endpoints } from "../services/api";
// import { apiConnector } from '../services/apiConnector';
import { useNavigate } from "react-router-dom";

const {
  SIGNUP_API
}=endpoints

function Signup() {
        const navigate = useNavigate();
      
        const handleSignup = async () => {
          try {
            // console.log("This is the signup api",SIGNUP_API);
            window.location.href = SIGNUP_API;
            navigate('/');
          } catch (error) {
            // Handle errors, e.g., show error message
            console.error("Error signing up:", error);
          }
        };
    return(
        <div className="flex items-center justify-center min-h-screen bg-richblack-900">
            <button onClick={handleSignup} className="bg-blue-500 text-white p-2 rounded">Sign Up With Google</button>
            {/* <button onClick={handleSignup}>Signup With Google</button> */}
        </div>
    )
}

export default Signup