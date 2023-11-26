import { FiPlus } from "react-icons/fi";
import { FiSave } from "react-icons/fi";

const GeneratedImageSection = ({
	id,
	imageUrl,
	title,
	comment,
	isLoading,
	setTitle,
	setComment,
	handleAdd,
	handleSave,
	handleRemove,
	adding,
}) => {
	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleCommentChange = (e) => {
		setComment(e.target.value);
	};

	return (
		<div>
			{id}
			{imageUrl ? (
				<div>
					<div className="about-image-edit">
						<div>
							<input
								type="text"
								className="field"
								value={title}
								placeholder="title"
								onChange={handleTitleChange}
							/>
							<input
								type="text"
								className="field"
								value={comment}
								placeholder="comment"
								onChange={handleCommentChange}
							/>
						</div>

						{adding ? (
							<button className="save-button" onClick={handleAdd}>
								<FiPlus className="icon" />
							</button>
						) : (
							<>
								<button className="save-button" onClick={handleSave}>
									<FiSave className="icon" />
								</button>
								<button onClick={() => handleRemove(id)}>Remove</button>
							</>
						)}

						{id}
					</div>

					<img className="image-generated" src={imageUrl} alt="Generated" />
				</div>
			) : (
				<div>{isLoading ? "This might take some time..." : ""}</div>
			)}
		</div>
	);
};

export default GeneratedImageSection;
