import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/ComicDetails.css";

const ComicDetails = () => {
	const { id } = useParams(); // Get the ID from the URL params
	const [comic, setComic] = useState(null);

	useEffect(() => {
		const fetchComicById = async () => {
			try {
				const docRef = doc(db, "projects", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setComic({ id: docSnap.id, ...docSnap.data() });
				} else {
					console.log("No such comic!");
					// Handle the case where the comic with the given ID doesn't exist
				}
			} catch (error) {
				console.error("Error fetching comic:", error);
			}
		};
		console.log(comic);

		if (id) {
			fetchComicById();
		}
	}, [id, comic]);

	if (!comic) {
		return <div>Loading...</div>; // Display a loading message while fetching data
	}

	return (
		<div className="comic-details">
			<div className="title">
				{comic.id}
				<p className="creator-comic">
					by <strong>{comic.userId}</strong>
				</p>
			</div>
			<div className="comic-pages">
				{comic.imageMapping.map((imageMap, index) => (
					<div key={index} className="comic-page">
						<div className="comic-details-page">
							<p> {imageMap.title}</p>
						</div>
						<div>
							{imageMap.imageBase64 && (
								<img
									className="comic-details-image"
									src={`data:image/jpeg;base64,${imageMap.imageBase64}`}
									alt={imageMap.description || `Image ${index + 1}`}
								/>
							)}
							{/* Render other properties from imageMap as needed */}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ComicDetails;
