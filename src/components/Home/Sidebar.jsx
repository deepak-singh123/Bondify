import { RiAccountCircleFill, RiHome5Fill, RiGroupFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/userSlice";

const Sidebar = () => {
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

    const menuItems = [
        { id: 'home', icon: <RiHome5Fill />, label: 'Home', onClick: () => navigate('/home') },
        { id: 'account', icon: <RiAccountCircleFill />, label: 'Account', onClick: () => navigate('/account') },
        { id: 'settings', icon: <IoSettingsSharp />, label: 'Settings', onClick: () => navigate('/settings') },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-options">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`sidebar-btn ${activeItem === item.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveItem(item.id);
                            item.onClick();
                        }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
                
                <div className="sidebar-btn" onClick={handleLogout}>
                    <CiLogout />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;