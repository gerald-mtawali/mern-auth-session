import {Routes, Route} from 'react-router-dom'; 
import Login from './components/Login'; 
import Signup from './components/Signup'; 

function RoutesComp() {
    return (
        <Routes>
            <Route path="/" element={<Login />} /> 
            <Route path="/signup" element={<Signup />} /> 
        </Routes>
    );
}

export default RoutesComp; 