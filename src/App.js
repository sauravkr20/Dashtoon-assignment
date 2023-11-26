import { Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Saved from "./pages/Saved";
import Read from "./pages/Read";
import ComicDetails from "./components/ComicDetails";

function App() {
	let { currentUser } = useContext(AuthContext);

	const RequireAuth = ({ children }) => {
		return currentUser ? children : <Navigate to="/login" />;
	};

	console.log(currentUser);

	return (
		<div className="App">
			<RequireAuth>
				<Navbar />
			</RequireAuth>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					exact
					path="/"
					element={
						<RequireAuth>
							<Home />
						</RequireAuth>
					}
				/>
				<Route
					exact
					path="/read"
					element={
						<RequireAuth>
							<Read />
						</RequireAuth>
					}
				/>
				<Route
					exact
					path="/saved"
					element={
						<RequireAuth>
							<Saved />
						</RequireAuth>
					}
				/>
				<Route path="/comic/:id" element={<ComicDetails />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
