import { Navigate, useLocation } from "react-router-dom"


const PrivateRoute = ({children}) => {

    const {state} = useLocation();

    return state?.logged ? children : <Navigate to="/login" replace={true} />
}

export default PrivateRoute