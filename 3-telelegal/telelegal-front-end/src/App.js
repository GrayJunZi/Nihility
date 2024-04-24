import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import MainVideoPage from "./components/video/MainVIdeoPage";
import ProDashboard from "./components/site/ProDashboard";
import ProMainVideoPage from "./components/video/ProMainVIdeoPage";

const Home = () => <h1>Hello, Home page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route extra path="/" Component={Home}></Route>
        <Route path="/join-video" Component={MainVideoPage}></Route>
        <Route path="/join-video-pro" Component={ProMainVideoPage}></Route>
        <Route path="/dashboard" Component={ProDashboard}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
