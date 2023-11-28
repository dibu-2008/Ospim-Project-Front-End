import { Navigate, useLocation } from "react-router-dom"


const PrivateRoute = ({ children }) => {

    const { state } = useLocation();

    if (state) 
        localStorage.setItem('state', JSON.stringify(state))

    const localState = localStorage.getItem('state')
    const localStateParse = JSON.parse(localState)
    
    if (localStateParse && localStateParse.logged) {
        return children;
    }else {
        return <Navigate to="/login" state={{ from: "/" }} replace={true} />;
    }

}

export default PrivateRoute





 /* const { state } = useLocation();

    if (state && state.logged) {
        return children;
    } else {
        return <Navigate to="/login" state={{ from: "/" }} replace={true} />;
    }  */