import Link from "next/link";

export function CateringSetContent() {
  return (
    <div className="catering-set-content">
      <p className="catering-set-line catering-set-line--highlight">
        The ULTIMATE Catering Pack!
      </p>
      <p className="catering-set-line catering-set-line--highlight-alt">
        Leave as what you have
      </p>
      <div className="catering-set-items">
        <p className="catering-set-line catering-set-line--item">
          MIX 16 ROLL SET PAX 4-6
        </p>
        <p className="catering-set-line catering-set-line--item">
          6 x Lobster Roll
        </p>
        <p className="catering-set-line catering-set-line--item">
          5 x Soft Shell Crab Roll
        </p>
        <p className="catering-set-line catering-set-line--item">
          5 x Prawn Roll
        </p>
      </div>
      <Link href="/catering" className="catering-set-button">
        Order Online
      </Link>
    </div>
  );
}
