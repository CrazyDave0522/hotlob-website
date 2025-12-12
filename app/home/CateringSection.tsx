"use client";

import Link from "next/link";
import Image from "next/image";

export default function CateringSection() {

	return (
		<section className="catering-section relative w-full">
			<Image
				src="/images/home-bg-catering-mb.png"
				alt="Catering background"
				width={750}
				height={580}
				className="catering-bg-mobile w-full h-auto"
				priority
				sizes="(max-width:750px) 100vw, 750px"
			/>
			<Image
				src="/images/home-bg-catering.png"
				alt="Catering background"
				width={1920}
				height={669}
				className="catering-bg-desktop w-full h-auto"
				priority
				sizes="(max-width:1023px) 0vw, 100vw"
			/>

			<div className="catering-top">
				<h1 className="catering-section-title text-[#FFD632] text-center font-semibold leading-normal">
					The ULTIMATE Catering Pack!
				</h1>

				<h2 className="catering-section-title text-white text-center font-semibold leading-normal catering-subtitle">
					Leave as what you have
				</h2>

				<div className="catering-content">
					<div className="catering-content-text text-white text-center font-normal w-[72.917%] max-w-[1400px] mx-auto flex flex-col items-center">
						<div className="text-left">
							<p className="font-semibold">MIX 16 ROLL SET PAX 4-6</p>
							<p>6 x Lobster Roll</p>
							<p>5 x Soft Shell Crab Roll</p>
							<p>5 x Prawn Roll</p>
						</div>
					</div>
				</div>
			</div>

			<div className="catering-button-wrapper">
				<Link
					href="/catering#catering-form"
					className="catering-order-btn transition-all duration-200 text-[#1D1E1F] hover:text-[#EA4148] hover:bg-gray-50 active:text-[#EA4148] active:bg-gray-100 active:scale-95 focus:text-[#EA4148] focus:bg-gray-100 focus:scale-95 md:focus:scale-100 md:focus:bg-transparent md:focus:text-[#1D1E1F]"
				>
					Order Online
				</Link>
			</div>
		</section>
	);
}

