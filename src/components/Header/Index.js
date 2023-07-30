import React, { useEffect } from 'react'
import './Style.css'
import { auth} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg";


function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);

    function handleLogout() {
        try {
            signOut(auth)
              .then(() => {
                // Sign-out successful.
                  toast.success("Sign-out successful.");
                  navigate("/")
              })
              .catch((e) => {
                // An error happened.
                  toast.error(e.message);
              });
            
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
      <div className="navbar">
        <p className="logo">Finacily</p>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:"0.50rem"}}>
            <img
              src={user.photoURL ? user.photoURL : userImg}
              style={{ borderRadius: "50%" ,width:"2rem",height:"2rem"}}
            />
            <p className="logo link" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>
    );
}

export default Header;