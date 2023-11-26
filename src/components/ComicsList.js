import React from "react";
import "../styles/ComicsList.css";
import { Link } from "react-router-dom";

const ComicsList = ({ comics }) => {
	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${day}/${month} ${hours}:${minutes}`;
	};

	return (
		<div className="comics-list">
			<table>
				<thead>
					<tr>
						<th>title</th>
						<th>creator</th>
						<th>created at</th>
					</tr>
				</thead>
				<tbody>
					{comics.map((comic) => (
						<tr key={comic.id}>
							<td>
								<Link to={`/comic/${comic.id}`}>{comic.id}</Link>
							</td>
							<td>{comic.userId}</td>
							<td>{formatTimestamp(comic.timestamp)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ComicsList;
