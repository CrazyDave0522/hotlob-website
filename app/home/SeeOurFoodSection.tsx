"use client";

import DishCard from "../see-our-food/components/dish-card";
import { Dish } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionTitle } from "../components/SectionTitle";

interface SeeOurFoodSectionProps {
	dishes: Dish[];
}

export default function SeeOurFoodSection({ dishes }: SeeOurFoodSectionProps) {
	const router = useRouter();
	const [hovered, setHovered] = useState(false);

	// Display only the first 4 dishes
	const topDishes = dishes.slice(0, 4);

	return (
		<section className="see-our-food-section relative w-full">
			<Image
				src="/images/home-bg-see-our-food-mb.png"
				alt="See our food background"
				width={750}
				height={1750}
				className="see-our-food-bg-mobile w-full h-auto"
				priority
				sizes="(max-width:750px) 100vw, 750px"
			/>
			<Image
				src="/images/home-bg-see-our-food.png"
				alt="See our food background"
				width={1920}
				height={920}
				className="see-our-food-bg-desktop w-full h-auto"
				priority
				sizes="(max-width:1023px) 0vw, 100vw"
			/>

			<div className="see-our-food-overlay">
				<SectionTitle>See our food</SectionTitle>
				<div className="see-our-food-cards">
					{topDishes.map((dish, idx) => (
						<div key={dish.id} className="see-our-food-card-wrapper">
							<DishCard dish={dish} priority={idx < 4} />
						</div>
					))}
				</div>
				<button
					onClick={() => router.push("/see-our-food")}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					className="see-our-food-more-btn button-click"
				>
					<div className="see-our-food-more-icon">
						<Image
							src={hovered ? "/images/icons/arrow-right-active.svg" : "/images/icons/arrow-right.svg"}
							alt="more"
							width={50}
							height={50}
							className="see-our-food-arrow-mobile"
						/>
						<Image
							src={hovered ? "/images/icons/arrow-right-active.svg" : "/images/icons/arrow-right.svg"}
							alt="more"
							width={20}
							height={20}
							className="see-our-food-arrow-desktop"
						/>
					</div>
					<span className={`see-our-food-more-text ${hovered ? "text-[#EA4148]" : "text-[#86909C]"}  active:text-[#D32F2F]`}>
						More
					</span>
				</button>
			</div>
		</section>
	);
}
