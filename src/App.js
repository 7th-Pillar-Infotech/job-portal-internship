import "./App.css";
import { HomePage } from "./pages/Home";
import { NavBar } from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Listings from "./pages/Listings";
import ListingSelected from "./pages/ListingSelected";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <NavBar /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:jobId" element={<ListingSelected />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
