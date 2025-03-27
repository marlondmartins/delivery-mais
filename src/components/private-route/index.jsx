import { Navigate } from "react-router-dom";

function PrivateRoute(props){
    const logado = localStorage.getItem('sessionToken') ? true : false;

    return logado ? props.children : <Navigate to="/login" />;
}

export default PrivateRoute;