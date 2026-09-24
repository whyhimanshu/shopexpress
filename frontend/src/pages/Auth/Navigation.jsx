import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineMenu,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FaHeart, FaMoon, FaStore, FaSun } from "react-icons/fa";
import { FiChevronDown, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = ({ darkMode, setDarkMode }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    await logoutApiCall().unwrap();
    dispatch(logout());
    navigate("/login");
  };

  const searchHandler = (event) => {
    event.preventDefault();
    navigate(search.trim() ? `/search/${search.trim()}` : "/shop");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="market-header">
      <div className="market-header-main">
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX size={23} /> : <AiOutlineMenu size={24} />}
        </button>

        <Link to="/" className="market-brand" onClick={closeMenu}>
          <span className="brand-mark">S</span>
          <span>
            <strong>ShopExpress</strong>
            <small>One stop shop for all your needs</small>
          </span>
        </Link>

        <form className="market-search" onSubmit={searchHandler}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brands and more"
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search">
            <AiOutlineSearch size={22} />
          </button>
        </form>

        <nav className="market-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/favorite" className="header-action" title="Favorites">
            <FaHeart />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="header-action cart-action" title="Cart">
            <AiOutlineShoppingCart size={24} />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <b>{cartItems.reduce((total, item) => total + item.qty, 0)}</b>
            )}
          </Link>
          <button
            className="account-action"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
          >
            <FaStore />
            <span>{userInfo ? userInfo.username : "Account"}</span>
            <FiChevronDown className={accountOpen ? "rotate-180" : ""} />
          </button>
          {accountOpen && (
            <div className="account-menu">
              {userInfo ? (
                <>
                  {userInfo.isAdmin && <Link to="/admin/dashboard">Admin dashboard</Link>}
                  {userInfo.isAdmin && <Link to="/admin/userlist">Users</Link>}
                  <Link to="/profile">Profile</Link>
                  <button onClick={logoutHandler}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login"><AiOutlineLogin /> Login</Link>
                  <Link to="/register"><AiOutlineUserAdd /> Create account</Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className={`market-category-bar ${menuOpen ? "is-open" : ""}`}>
        <Link to="/" onClick={closeMenu}><AiOutlineHome /> Home</Link>
        <Link to="/shop" onClick={closeMenu}><FaStore /> Shop all</Link>
        <Link to="/shop" onClick={closeMenu}>New arrivals</Link>
        <Link to="/shop" onClick={closeMenu}>Best sellers</Link>
        <Link to="/favorite" onClick={closeMenu}>Your wishlist</Link>
      </div>
    </header>
  );
};

export default Navigation;
