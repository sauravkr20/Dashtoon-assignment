import React, { useContext, useState } from "react";
import { auth } from "../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const [error, setError] = useState(false);

	const navigate = useNavigate();

	const { dispatch } = useContext(AuthContext);

	const handleGoogleLogin = () => {
		const provider = new GoogleAuthProvider();

		signInWithPopup(auth, provider)
			.then((result) => {
				const user = result.user;
				dispatch({ type: "LOGIN", payload: user });
				navigate("/");
			})
			.catch((error) => {
				setError(true);
			});
	};

	return (
		<div className="login">
			<img
				alt="logo-main"
				src="https://www.online-tech-tips.com/wp-content/uploads/2019/09/kapow-comic-book.png"
			/>

			<button onClick={handleGoogleLogin}>Login with Google</button>

			{error && <span>Wrong email or password</span>}
		</div>
	);
};

export default Login;
