import React from "react";
import welcomeImg from "../../assets/homeAnime.png";
import { TypeAnimation } from "react-type-animation";
import "./home.css";

export const Home = () => {
	return (
		<div className="home">
			<TypeAnimation
				sequence={[
					// Same substring at the start will only be typed out once, initially
					"Welcome to the premier destination for mind-bending puzzles!",
					1000, // wait 1s before replacing "Mice" with "Hamsters"
					"Signup and face our advanced math riddles!",
					1000,
				]}
				wrapper="span"
				speed={50}
				style={{ display: "inline-block", color: "#ffe32e" }}
				repeat={Infinity}
				className="textAnimation"
			/>

			<div className="welcomeImage">
				<img src={welcomeImg} alt="img" color="lightorange" />
			</div>
		</div>
	);
};
