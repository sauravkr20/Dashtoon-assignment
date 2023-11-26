import React, { useEffect, useState } from "react";
import ComicsList from "../components/ComicsList";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase";

const Read = () => {
	const [comics, setComics] = useState([]);
	const fetchComicsFromFirestore = async () => {
		try {
			const comicsCollection = collection(db, "projects");
			const querySnapshot = await getDocs(comicsCollection);

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
				console.log(savedComics);
				setComics(savedComics);
				console.log(comics);
			} catch (error) {
				console.error("Error fetching saved comics:", error);
			}
		};

		fetchSavedComics();
	}, [comics]);

	return (
		<div className="saved">
			<div className="title">Comics from All</div>
			<ComicsList comics={comics} />
		</div>
	);
};

export default Read;
