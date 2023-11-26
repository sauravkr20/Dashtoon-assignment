import React, { useEffect, useState } from "react";
import ComicsList from "../components/ComicsList";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { db } from "../firebase";

const Saved = () => {
	const { currentUser } = useContext(AuthContext);

	const [comics, setComics] = useState([]);
	const fetchComicsFromFirestore = async () => {
		try {
			const comicsCollection = collection(db, "projects");
			const querySnapshot = await getDocs(
				query(
					collection(db, "projects"),
					where("userId", "==", currentUser.displayName)
				)
			);

			const comicsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			return comicsData;
		} catch (error) {
			console.error("Error fetching comics:", error);
			return [];
		}
	};

	useEffect(() => {
		const fetchSavedComics = async () => {
			try {
				const savedComics = await fetchComicsFromFirestore(); // Fetching comics from Firestore

				setComics(savedComics);
			} catch (error) {
				console.error("Error fetching saved comics:", error);
			}
		};

		fetchSavedComics();
	}, []);

	return (
		<div className="saved">
			<div className="title">Your Comics</div>
			<ComicsList comics={comics} />
		</div>
	);
};

export default Saved;
