"use client";

import { useState } from "react";
import { SectionTitle } from "../components/SectionTitle";

const cards = [
	{
		id: 1,
		title: "A quick bite that feels like a treat",
		description:
			"Hotlob takes the premium lobster roll experience and makes it fun, fast, and affordable. Now, our takeaway rolls bring big flavour in a small brioche —  the perfect grab-and-go roll that fits any craving or budget.",
		bgCollapsed: "/images/three-column-cards/card1.png",
		bgExpanded: "/images/three-column-cards/card1-active.png",
	},
	{
		id: 2,
		title: "Our Story",
		description:
			"Born from our original restaurant, The Lobster Pier (est. 2018 in WA), we wanted everyone to enjoy Aussie lobster without the fine-dining price tag.",
		bgCollapsed: "/images/three-column-cards/card2.png",
		bgExpanded: "/images/three-column-cards/card2-active.png",
	},
	{
		id: 3,
		title: "🦞 The Hotlob Hits",
		description: `✨ Truffle & Cheese Lobster Roll
Our signature. Rich truffle sauce, Aussie lobster, and torched parmesan for perfection.
✨ Lemon & Dill Lobster Roll
Light but creamy and addictive — fresh Australian lobster tossed with dill mayo and lemon dressing.
✨ Soft Shell Crab Roll
Crispy soft-shell crab with Thai green sauce, topped with fresh chilli slices for the perfect balance of crunch and heat.`,
		bgCollapsed: "/images/three-column-cards/card3.png",
		bgExpanded: "/images/three-column-cards/card3-active.png",
	},
];

export default function AboutHotlob() {
	const [expandedCard, setExpandedCard] = useState<number>(1); // Default: card 1 expanded

	return (
		<section className="about-hotlob-section relative w-full">
			{/* Background images: render both with responsive visibility */}
			{/* Unified responsive background handled via CSS media queries */}
			<div className="about-hotlob-bg absolute inset-0" aria-hidden="true" />

			{/* Desktop content - absolute positioned */}
			<div className="hidden lg:block about-desktop-full">
				{/* Title */}
				<SectionTitle>About Hotlob</SectionTitle>

				{/* Desktop: Three-column card container */}
				<div
					className="hidden lg:flex gap-5 shrink-0 w-[72.917%] mx-auto justify-center about-cards-desktop-dim"
				>
					{cards.map((card) => {
						const isExpanded = expandedCard === card.id;
						return (
							<div
								key={card.id}
								className="button-click shrink-0 relative cursor-pointer overflow-hidden rounded-[20px]"
								style={{
									width: isExpanded ? "40%" : "28.571%", // 560/1400=40%, 400/1400=28.571%
									height: "100%", // Fill parent container height
									transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
								}}
								onMouseEnter={() => setExpandedCard(card.id)}
								onClick={() => setExpandedCard(card.id)}
							>
								{/* Background images with crossfade effect */}
								<div
									className="absolute inset-0 transition-opacity duration-400"
									style={{
										backgroundImage: `url(${card.bgCollapsed})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										opacity: isExpanded ? 0 : 1,
									}}
								/>
								<div
									className="absolute inset-0 transition-opacity duration-400"
									style={{
										backgroundImage: `url(${card.bgExpanded})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										opacity: isExpanded ? 1 : 0,
									}}
								/>

								{/* Card content */}
								<div
									className="absolute inset-0 flex flex-col px-[30px] about-card-content-padding-desktop"
								>
									<h3
										className="about-hotlob-tab-text font-semibold leading-normal transition-colors duration-400 about-card-title-margin"
										style={{
											color: isExpanded ? "#FFF" : "#333",
											fontSize: isExpanded
												? "clamp(21px, 1.35vw, 26px)"
												: "clamp(20px, 1.25vw, 24px)",
											transition: "color 400ms, font-size 400ms",
										}}
									>
										{card.title}
									</h3>
									<p
										className="text-base font-normal overflow-hidden text-white whitespace-pre-line"
										style={{
											display: "-webkit-box",
											WebkitLineClamp: 10,
											WebkitBoxOrient: "vertical",
											// Spacing between paragraphs is controlled by line-height.
											// At 1920px it's 24px; it scales down on smaller screens.
											lineHeight: isExpanded
												? "clamp(21px, 1.35vw, 26px)"
												: "clamp(20px, 1.25vw, 24px)",
											fontSize: isExpanded
												? "clamp(17px, 1.04vw, 20px)"
												: "clamp(16px, 0.94vw, 18px)",
											opacity: isExpanded ? 1 : 0,
											transition: isExpanded
												? "opacity 300ms ease-in 280ms, font-size 400ms, line-height 400ms"
												: "opacity 200ms ease-out, font-size 400ms, line-height 400ms",
											pointerEvents: isExpanded ? "auto" : "none",
										}}
									>
										{card.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Mobile content - natural flow to expand section height */}
			<div className="lg:hidden relative z-10 px-4 pb-8 pt-4">
				{/* Title */}
				<SectionTitle>About Hotlob</SectionTitle>

				{/* Mobile: Two-row card layout */}
				<div
					className="flex flex-col items-center justify-end"
					style={{
						// Vertical gap between the two card rows
						gap: "clamp(10px, calc(20/750*100vw), 20px)",
					}}
				>
					{/* First row: Active card takes full width */}
					<div
						className="w-full flex justify-center"
						style={{
							transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
						}}
					>
						{cards
							.filter((card) => expandedCard === card.id)
							.map((card) => {
								const isActive = true; // Expanded card is considered active
								return (
									<div
										key={card.id}
										className="button-click relative cursor-pointer overflow-hidden rounded-[20px]"
										style={{
											width: "clamp(345px, calc(690/750*100vw), 690px)",
											height: "clamp(150px, calc(300/750*100vw), 300px)",
											flexShrink: 0,
											maxWidth: "100%",
											margin: "0 clamp(15px, calc(30/750*100vw), 30px)", // Horizontal side margins
											transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
											transform: "scale(1)",
											transformOrigin: "center",
										}}
										onClick={() => setExpandedCard(card.id)}
									>
										{/* Background image */}
										<div
											className="absolute inset-0"
											style={{
												backgroundImage: `url(${card.bgExpanded.replace(
													".png",
													"-mb.png"
												)})`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}}
										/>

										{/* Card content */}
										<div
											className="absolute inset-0 flex flex-col"
											style={{
												paddingTop: "clamp(20px, calc(40/750*100vw), 40px)",
												paddingLeft: "clamp(10px, calc(20/750*100vw), 20px)",
												paddingRight: "clamp(10px, calc(20/750*100vw), 20px)",
												paddingBottom: "clamp(10px, calc(20/750*100vw), 20px)",
												transition:
													"all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
												opacity: 1,
												transform: "translateY(0px)",
											}}
										>
											<h3
												className="about-hotlob-card-title font-semibold"
												style={{
													color: "#FFF",
													fontStyle: "normal",
													lineHeight: "normal",
													marginBottom: "clamp(10px, calc(20/750*100vw), 20px)",
													fontSize: isActive
														? "clamp(15px, calc(26/750*100vw), 26px)"
														: "clamp(14px, calc(24/750*100vw), 24px)",
													transition:
														"font-size 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
												}}
											>
												{card.title}
											</h3>
											<p
												className="about-hotlob-card-desc"
												style={{
													color: "#FFF",
													fontStyle: "normal",
													fontWeight: 400,
													lineHeight: "clamp(12px, calc(24/750*100vw), 24px)",
													fontSize: "clamp(12px, calc(18/750*100vw), 18px)",
													overflow: "hidden",
													display: "-webkit-box",
													WebkitLineClamp: 7,
													WebkitBoxOrient: "vertical",
													whiteSpace: "pre-line",
													transition:
														"font-size 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
												}}
											>
												{card.description}
											</p>
										</div>
									</div>
								);
							})}
					</div>

					{/* Second row: Two inactive cards side by side */}
					<div
						className="flex justify-center"
						style={{
							// Horizontal gap between inactive cards
							gap: "clamp(15px, calc(30/750*100vw), 30px)",
							transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
						}}
					>
						{cards
							.filter((card) => expandedCard !== card.id)
							.map((card) => (
								<div
									key={card.id}
									className="button-click relative cursor-pointer overflow-hidden rounded-[20px]"
									style={{
										width: "clamp(165px, calc(330/750*100vw), 330px)",
										height: "clamp(150px, calc(300/750*100vw), 300px)",
										flexShrink: 0,
										transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
										transform: "scale(1)",
										transformOrigin: "center",
									}}
									onClick={() => setExpandedCard(card.id)}
								>
									{/* Background image */}
									<div
										className="absolute inset-0"
										style={{
											backgroundImage: `url(${card.bgCollapsed.replace(
												".png",
												"-mb.png"
											)})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									/>

									{/* Card content */}
									<div
										className="absolute inset-0 flex flex-col"
										style={{
											paddingTop: "clamp(20px, calc(40/750*100vw), 40px)",
											paddingLeft: "clamp(10px, calc(20/750*100vw), 20px)",
											paddingRight: "clamp(10px, calc(20/750*100vw), 20px)",
											paddingBottom: "clamp(10px, calc(20/750*100vw), 20px)",
											transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
											opacity: 1,
											transform: "translateY(0px)",
										}}
									>
										<h3
											style={{
												color: "#333",
												fontStyle: "normal",
												fontWeight: 600,
												lineHeight: "normal",
												marginBottom: "clamp(10px, calc(20/750*100vw), 20px)",
												fontSize: "clamp(16px, calc(26/750*100vw), 26px)",
												transition:
													"font-size 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
											}}
											className="about-hotlob-card-title"
										>
											{card.title}
										</h3>
										<p
											className="about-hotlob-card-desc"
											style={{
												color: "#4E5969",
												fontStyle: "normal",
												fontWeight: 400,
												lineHeight: "clamp(12px, calc(24/750*100vw), 24px)",
												fontSize: "clamp(12px, calc(18/750*100vw), 18px)",
												overflow: "hidden",
												display: "-webkit-box",
												WebkitLineClamp: 7,
												WebkitBoxOrient: "vertical",
												whiteSpace: "pre-line",
												transition:
													"font-size 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
											}}
										>
											{card.description}
										</p>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</section>
	);
}
