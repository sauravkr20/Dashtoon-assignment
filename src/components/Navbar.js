import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
	const { dispatch } = useContext(AuthContext);

	const handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				dispatch({ type: "LOGOUT" });
			})
			.catch((error) => {
				// Handle any potential errors here
				console.error("Error signing out:", error);
			});
	};

	return (
		<div className="navbar">
			<Link to="/" className="navbar-logo">
				<img
					alt="logo-main"
					src="https://www.online-tech-tips.com/wp-content/uploads/2019/09/kapow-comic-book.png"
				/>
			</Link>
			<div className="menu">
				<Link to="/read" className="menu-item">
					Read Other
				</Link>
				<Link to="/saved" className="menu-item">
					Saved Comics
				</Link>
				<div className="menu-item" onClick={handleLogout}>
					Logout
				</div>
			</div>
		</div>
	);
};

export default Navbar;
