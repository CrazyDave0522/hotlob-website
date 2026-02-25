import { SectionTitle } from "@/components/layout/SectionTitle";
import { CateringForm } from "@/components/catering/CateringForm";

export default function CateringPage() {
  return (
    <main className="CateringPage-root">
      <section className="CateringPage-top">
        <div className="CateringPage-topContent">
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
          </div>
          <div className="CateringPage-topTitle CateringPage-topTitle--mobile">
            <SectionTitle
              text="ORDER NOW"
              subtitle="Please note that orders need to be placed 48 hours (business days) ahead of pick up day."
            />
          </div>
        </div>
      </section>
      <section className="CateringPage-bottom">
        <div className="CateringPage-bottomTitle">
          <SectionTitle
            text="ORDER NOW"
            subtitle="Please note that orders need to be placed 48 hours (business days) ahead of pick up day."
          />
        </div>
        <div className="CateringPage-bottomContent">
          <div className="CateringPage-formColumn">
            <CateringForm />
          </div>
          <div className="CateringPage-emptyColumn" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
