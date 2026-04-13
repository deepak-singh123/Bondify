import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../store/userSlice';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((store) => store.user.isLoggedIn);
    const user = useSelector((store) => store.user.user);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await dispatch(fetchUserData()).unwrap();
                setIsChecking(false);
            } catch (error) {
                navigate('/login');
                setIsChecking(false);
            }
        };

        if (!isLoggedIn) {
            checkAuthentication();
        } else {
            setIsChecking(false);
        }
    }, [dispatch, isLoggedIn, navigate]);

    if (isChecking) {
        return <div>Checking authentication...</div>;
    }

    if (!isLoggedIn || !user) {
        return null;
    }


    return children;
};

export default ProtectedRoute;
