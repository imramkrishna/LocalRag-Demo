import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Chat />} path="/chat" />
        <Route element={<Home />} path="/" />
        <Route element={<Navigate replace to="/chat" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
