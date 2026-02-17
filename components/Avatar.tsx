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
  const fallbackTextSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={`rs-avatar rs-avatar--${size} ${className}`.trim()}>
      {photoUrl ? (
        // use img to avoid remote next/image config
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={name ?? "Reviewer"} />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${fallbackTextSize} text-gray-600`}
        >
          {name?.charAt(0) ?? "?"}
        </div>
      )}
    </div>
  );
}
