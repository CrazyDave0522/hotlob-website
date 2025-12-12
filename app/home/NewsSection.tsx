"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

	const goToSlide = useCallback((index: number) => {
		if (index === currentIndex) return;

		setFadeOut(true);
		setTimeout(() => {
			setCurrentIndex(index);
			setFadeOut(false);
		}, 400);
	}, [currentIndex]);

	// Touch / swipe handling for mobile carousel (native listeners with passive:false)
	const touchStartXRef = useRef<number | null>(null);
	const touchStartYRef = useRef<number | null>(null);
	const touchDeltaXRef = useRef<number>(0);
	const carouselRef = useRef<HTMLDivElement | null>(null);

	const handleTouchStart = useCallback((e: TouchEvent) => {
		if (news.length <= 1) return;
		touchStartXRef.current = e.touches[0].clientX;
		touchStartYRef.current = e.touches[0].clientY;
		touchDeltaXRef.current = 0;
		setIsPaused(true);
	}, [news.length]);

	const handleTouchMove = useCallback((e: TouchEvent) => {
		if (touchStartXRef.current === null) return;
		const dx = e.touches[0].clientX - touchStartXRef.current;
		const dy = e.touches[0].clientY - (touchStartYRef.current ?? 0);
		touchDeltaXRef.current = dx;
		// If horizontal swipe is dominant, prevent vertical page bounce
		if (Math.abs(dx) > Math.abs(dy)) {
			e.preventDefault();
		}
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (touchStartXRef.current === null) {
			setIsPaused(false);
			return;
		}
		const dx = touchDeltaXRef.current;
		const threshold = 50; // px required to consider a swipe
		if (dx <= -threshold) {
			goToSlide((currentIndex + 1) % news.length);
		} else if (dx >= threshold) {
			goToSlide((currentIndex - 1 + news.length) % news.length);
		}
		touchStartXRef.current = null;
		touchStartYRef.current = null;
		touchDeltaXRef.current = 0;
		setIsPaused(false);
	}, [currentIndex, goToSlide, news.length]);

	useEffect(() => {
		const el = carouselRef.current;
		if (!el) return;

		// Attach native listeners so we can call preventDefault on touchmove
		const onStart = (ev: TouchEvent) => handleTouchStart(ev);
		const onMove = (ev: TouchEvent) => handleTouchMove(ev);
		const onEnd = () => handleTouchEnd();

		el.addEventListener("touchstart", onStart, { passive: true });
		// touchmove must be non-passive to allow preventDefault
		el.addEventListener("touchmove", onMove as EventListener, { passive: false });
		el.addEventListener("touchend", onEnd);

		return () => {
			el.removeEventListener("touchstart", onStart as EventListener);
			el.removeEventListener("touchmove", onMove as EventListener);
			el.removeEventListener("touchend", onEnd as EventListener);
		};
 	}, [news.length, currentIndex, handleTouchStart, handleTouchMove, handleTouchEnd]);

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
				<div
					className="news-carousel-mobile"
					ref={carouselRef}
				>
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

