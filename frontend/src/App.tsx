import "./App.css";
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import UpdateMeeting from "./pages/UpdateMeeting";


function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:meetingID" element={<UpdateMeeting />} />
        
      </Routes>
    </>
  );
}

export default App;
