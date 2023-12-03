import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";



export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate(); 

    const logout = async () => {
        await axios.post('/logout');
        setUser(null);
        navigate('/');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }    
 

    return (
        <header className="header-container">
            
            <Link to={'/'} className="logo-section">
                <img src="/Icons/logo3.png" alt="logo" className="logo-img"/>
            </Link>

            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search.." 
                    className="search-input"
                />
            </div>

            <div className="user-profile">
                <Link to={user ? '/profilepage' : '/login'} className="profile-link">
                    <img src="/Icons/user2.png" alt="user" className="profile-img"/>
                    {user && <span className="user-name">{capitalizeFirstLetter(user.name)}</span>}
                </Link>
                
                {user && (
                    <button onClick={logout} className='logout-button'>Logout</button>
                )}
            </div>
        </header>

    );
}
