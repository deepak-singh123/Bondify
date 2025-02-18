import { RiAccountCircleFill, RiHome5Fill, RiGroupFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";
import { socket } from "../../App";

const Sidebar = ({currclass, sidebarRef}) => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('home');
    const dispatch = useDispatch();
   

   

    const handleLogout = async() => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                dispatch(clearUser());  // Dispatch the clearUser action
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleButtonClick = (e, item) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setActiveItem(item.id);
        item.onClick();
    };

    const handleLogoutClick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        handleLogout();
        
        socket.disconnect();
            
         
    };

    const menuItems = [
        { id: 'home', icon: <RiHome5Fill />, label: 'Home', onClick: () => navigate('/home') },
        { id: 'account', icon: <RiAccountCircleFill />, label: 'Account', onClick: () => navigate('/account') },
        { id: 'settings', icon: <IoSettingsSharp />, label: 'Settings', onClick: () => navigate('/settings') },
    ];

    return (
        <div ref={sidebarRef}  className={`sidebar ${currclass}`}>
            <div className="sidebar-options">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`sidebar-btn ${activeItem === item.id ? 'active' : ''}`}
                        onClick={(e) => handleButtonClick(e, item)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
                
                <div className="sidebar-btn" onClick={handleLogoutClick}>
                    <CiLogout />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;