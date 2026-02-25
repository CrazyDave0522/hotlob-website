import React from "react";
import "@/styles/components/store/google-map-embed.css";

interface GoogleMapEmbedProps {
  embedUrl: string;
  className?: string;
}

export default function GoogleMapEmbed({
  embedUrl,
  className,
}: GoogleMapEmbedProps) {
  return (
    <div
      className={`google-map-container ${className || ""}`}
      data-testid="google-map-embed"
    >
      <iframe
        src={embedUrl}
        className="google-map-iframe"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Store location map"
      />
    </div>
  );
}
