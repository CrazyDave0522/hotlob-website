"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NewsCard from "../news/components/news-card";
import { SectionTitle } from "../components/SectionTitle";

type NewsItem = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	coverImageUrl: string;
	publishDate: string;
};

interface NewsSectionProps {
	news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
	const router = useRouter();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [fadeOut, setFadeOut] = useState(false);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	// Auto-play logic
	useEffect(() => {
		if (isPaused || news.length <= 1) return;

		autoPlayRef.current = setInterval(() => {
			setFadeOut(true);
			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % news.length);
				setFadeOut(false);
			}, 400);
		}, 3500);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [isPaused, news.length, currentIndex]);

	const goToSlide = (index: number) => {
		if (index === currentIndex) return;
    
		setFadeOut(true);
		setTimeout(() => {
			setCurrentIndex(index);
			setFadeOut(false);
		}, 400);
	};

	const handleMouseEnter = () => {
		setIsPaused(true);
	};

	const handleMouseLeave = () => {
		setIsPaused(false);
	};

	if (news.length === 0) return null;

	return (
		<section className="news-section">
			<SectionTitle>Hot News</SectionTitle>

			{/* Carousel Container */}
			<div
				className="news-carousel-container"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className="news-carousel-mobile">
					<div
						className="transition-opacity duration-700 ease-in-out"
						style={{ opacity: fadeOut ? 0 : 1 }}
					>
						<NewsCard
							slug={news[currentIndex].slug}
							title={news[currentIndex].title}
							excerpt={news[currentIndex].excerpt}
							coverImageUrl={news[currentIndex].coverImageUrl}
							publishDate={news[currentIndex].publishDate}
							variant="home"
						/>
					</div>
				</div>
				<div className="news-carousel-desktop">
					<div
						className="absolute inset-0 transition-opacity duration-700 ease-in-out"
						style={{ opacity: fadeOut ? 0 : 1 }}
					>
						<NewsCard
							slug={news[currentIndex].slug}
							title={news[currentIndex].title}
							excerpt={news[currentIndex].excerpt}
							coverImageUrl={news[currentIndex].coverImageUrl}
							publishDate={news[currentIndex].publishDate}
							variant="home"
						/>
					</div>
				</div>
			</div>

			{/* Indicators */}
			<div className="news-indicators">
				{news.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`news-indicator button-click ${currentIndex === index ? 'news-indicator--active' : ''}`}
						aria-label={`Go to news ${index + 1}`}
					/>
				))}
			</div>

			{/* Learn More Button */}
			<button
				onClick={() => router.push("/news")}
				className="news-learn-more-btn button-click"
			>
				Learn More
				<Image
					src="/images/icons/angle-right.svg"
					alt="arrow right"
					width={24}
					height={24}
					className="news-arrow-mobile"
				/>
				<Image
					src="/images/icons/angle-right.svg"
					alt="arrow right"
					width={12}
					height={12}
					className="news-arrow-desktop"
				/>
			</button>
		</section>
	);
}

