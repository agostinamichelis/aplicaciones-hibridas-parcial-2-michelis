import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; 
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const auth = Cookies.get('jwToken') || null;
    const navigate = useNavigate(); 

    useEffect(() => {
        if (auth) {
            try {
                const decoded = jwtDecode(auth);

                setUser({
                    name: decoded.usuario.name,
                    _id: decoded.usuario._id,
                    username: decoded.usuario.username
                });
            } catch (error) {
                console.error("Token decoding failed", error);
                Cookies.remove('jwToken');
            }
        }
    }, [auth]);

    const logoutUser = () => {
        setUser(null);
        Cookies.remove('jwToken');
        navigate('/access');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, auth, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
