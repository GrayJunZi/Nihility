import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import socketConnection from "./utilities/socketConnection";
import MainVideoPage from "./components/video/MainVIdeoPage";

const Home = () => <h1>Hello, Home page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route extra path="/" Component={Home}></Route>
        <Route path="/join-video" Component={MainVideoPage}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
