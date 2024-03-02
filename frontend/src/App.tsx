import "./App.css";
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>SignIn</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/dashboard" element={<div>CRUD</div>} />
      </Routes>
    </>
  );
}

export default App;
