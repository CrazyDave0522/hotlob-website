import Image from "next/image";
import { User } from "lucide-react";

type AvatarProps = {
  photoUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md";
  className?: string;
};

export default function Avatar({
  photoUrl,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const imageSize = size === "sm" ? 32 : 40;

  return (
    <div className={`rs-avatar rs-avatar--${size} ${className}`.trim()}>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name ?? "Reviewer"}
          width={imageSize}
          height={imageSize}
          sizes={`${imageSize}px`}
          className="object-cover"
        />
      ) : (
        <User size={imageSize} aria-hidden="true" focusable="false" />
      )}
    </div>
  );
}
