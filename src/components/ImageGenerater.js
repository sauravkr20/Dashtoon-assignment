import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";
import GeneratedImageSection from "./GeneratedImageSection";
import yourImage from "../images/image.png";

import { collection, addDoc } from "firebase/firestore";

import { db } from "../firebase";

const ImageGenerator = () => {
	const { currentUser } = useContext(AuthContext);

	const [inputText, setInputText] = useState("");
	const [generatedImage, setGeneratedImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [adding, setAdding] = useState(true);
	const [imageMapping, setImageMapping] = useState([]);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [index, setIndex] = useState(0);
	const [showDisplayName, setShowDisplayName] = useState(true);

	const API_URL =
		"https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
	const headers = {
		Accept: "image/png",
		Authorization:
			"Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
		"Content-Type": "application/json",
	};

	const generateImage = async () => {
		try {
			setGeneratedImage(null);
			setIsLoading(true);

			const response = await fetch(API_URL, {
				headers,
				method: "POST",
				body: JSON.stringify({ inputs: inputText }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate image");
			}

			const imageBlob = await response.blob();
			const imageUrl = URL.createObjectURL(imageBlob);

			setGeneratedImage(imageUrl);
			setIsLoading(false);

			setImageMapping((prevMapping) => [
				...prevMapping,
				{
					inputText: inputText,
					imageUrl: generatedImage,
					title,
					comment,
				},
			]);

			setIndex((prevIndex) => prevIndex + 1);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setInputText(e.target.value);
	};

	const handleSave = (e) => {
		e.preventDefault();
		if (generatedImage) {
			setImageMapping((prevMapping) => {
				const updatedMapping = [...prevMapping];
				updatedMapping[index - 1] = {
					inputText,
					title,
					imageUrl: generatedImage,
					comment,
				};
				return updatedMapping;
			});

			setInputText(imageMapping[index - 1].inputText);
		}
	};

	const handleRemove = (id) => {
		console.log(id);
		if (imageMapping.length === 0) {
			setTitle("");
			setComment("");
			setIndex(0);
		} else {
			const newImageMapping = imageMapping.filter(
				(image, index) => index !== id - 1
			);
			setIndex(newImageMapping.length);

			if (newImageMapping.length > 0) {
				const clickedImage = newImageMapping[newImageMapping.length - 1];
				setTitle(clickedImage.title);
				setComment(clickedImage.comment);
			} else {
				setTitle("");
				setComment("");
			}

			setImageMapping(newImageMapping);
		}
	};

	const handleImageClick = (id) => {
		const clickedImage = imageMapping[id];
		setGeneratedImage(clickedImage.imageUrl);
		setIndex(parseInt(id, 10) + 1);
		setTitle(clickedImage.title);
		setComment(clickedImage.comment);
		setAdding(false);
	};

	const handleAdd = () => {
		const uniqueId = index; // Use a timestamp as a unique identifier

		setImageMapping((prevMapping) => [
			...prevMapping,
			{
				id: uniqueId,
				inputText: inputText,
				imageUrl: generatedImage,
				title,
				comment,
			},
		]);

		setAdding(false);

		setIndex((prevIndex) => prevIndex + 1);

		// Clear inputText and generatedImage
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// setGeneratedImage(yourImage);
		setAdding(true);
		setTitle("");
		setComment("");
		setShowDisplayName(false);
		//
		generateImage();
	};

	const handleSaveProject = async (imageMapping) => {
		try {
			const timestamp = new Date().toISOString();
			const userId = "your-user-id"; // Replace with your authentication logic

			// Get a reference to a new document within the "projects" collection
			const projectsCollection = collection(db, "projects");

			// Convert the image data (Blob) to a Base64 string
			const base64ImageMapping = await Promise.all(
				imageMapping.map(async (item, id) => {
					const response = await fetch(item.imageUrl);
					const blob = await response.blob();
					const base64 = await blobToBase64(blob);
					return {
						inputText: item.inputText,
						imageBase64: base64,
						title: item.title,
						comment: item.comment,
					};
				})
			);

			const newDocRef = await addDoc(projectsCollection, {
				timestamp,
				userId: currentUser.displayName,
				imageMapping: base64ImageMapping,
			});

			console.log("Image mapping saved successfully with ID: ", newDocRef.id);
		} catch (error) {
			console.error("Error saving image mapping:", error);
		}
	};

	// Function to convert Blob to Base64 string
	const blobToBase64 = (blob) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				resolve(reader.result.split(",")[1]);
			};
			reader.readAsDataURL(blob);
		});
	};

	return (
		<div>
			{showDisplayName && currentUser && currentUser.displayName && (
				<div className="hello-word">Hi, {currentUser.displayName}!</div>
			)}
			<div className="image-gen">
				<div className="item">
					<div className="mapping-container">
						<ul>
							{imageMapping.map((image, id) => (
								<li key={id} onClick={() => handleImageClick(id)}>
									<img src={image.imageUrl} alt="Generated" />
								</li>
							))}
						</ul>
					</div>
					<form onSubmit={handleSubmit}>
						<input
							className="gen-input"
							type="text"
							value={inputText}
							placeholder="An Impression oil painting of sunflower in a purple vase"
							onChange={handleInputChange}
						/>
						<button className="gen-button" type="submit" disabled={isLoading}>
							{isLoading ? (
								<div>
									<span className="loading-text">Generating...</span>
								</div>
							) : (
								"Generate Image"
							)}
						</button>

						<button
							className="gen-button"
							onClick={() => handleSaveProject(imageMapping)}
						>
							Save Project
						</button>

						{title}
						<br />
						{comment}
					</form>
				</div>
				<div
					className="item image-container"
					style={{ width: generatedImage || isLoading ? "50%" : "0" }}
				>
					<GeneratedImageSection
						id={index}
						imageUrl={generatedImage}
						title={title}
						comment={comment}
						isLoading={isLoading}
						setTitle={setTitle}
						setComment={setComment}
						handleAdd={handleAdd}
						handleSave={handleSave}
						handleRemove={handleRemove}
						adding={adding}
					/>
				</div>
			</div>
		</div>
	);
};

export default ImageGenerator;
