import React from "react";
import './mainTitle.css';

export const MainTitle = ({ title }) => {
	return (
		<div className="main-title">
			<div className="wrap">
				<p className="text">{title}</p>
				<p className="text">{title}</p>
				<p className="text">{title}</p>
			</div>
		</div>
	);
};
