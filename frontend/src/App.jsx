import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopAssistant from "./components/ShopAssistant";
import { useEffect, useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("shopexpress-theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("shopexpress-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <ToastContainer />
      <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
      <ShopAssistant />
      <main className="storefront-main py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;
