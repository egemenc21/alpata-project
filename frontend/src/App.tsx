import "./App.css";
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import axios from "axios";
import Dashboard from "./pages/Dashboard";

function App() {
  axios.defaults.baseURL = 'http://localhost:4000'
  axios.defaults.withCredentials = true
  
  return (
    <>
      <Routes>
        <Route path="/" element={<div>SignIn</div>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  );
}

export default App;
