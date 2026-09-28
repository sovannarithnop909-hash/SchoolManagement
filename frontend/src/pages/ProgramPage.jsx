import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { NotFoundPage } from "./NotFoundPage";
import { programs } from "./programs";

export function ProgramPage() {
  const { slug } = useParams();
  const { t } = useLocale();
  const program = programs.find((item) => item.slug === slug);

  if (!program) return <NotFoundPage />;

  return (
    <div className="page-shell program-page">
      <Link to="/#programs" className="secondary-btn program-back-link">
        <ArrowLeft size={16} /> {t("Back to programs")}
      </Link>

      <section className="program-detail-hero">
        <div className="program-detail-copy">
          <span className="eyebrow">{t("Programs")}</span>
          <h1>{t(program.title)}</h1>
          <p className="program-overview">{t(program.overview)}</p>
        </div>
        <img
          className="program-detail-image"
          src={program.image}
          alt={t(program.imageAlt)}
        />
      </section>

      <div className="program-detail-grid">
        <section className="program-detail-panel">
          <h2>{t("Areas of study")}</h2>
          <ul>
            {program.areas.map((area) => (
              <li key={area}>{t(area)}</li>
            ))}
          </ul>
        </section>
        <section className="program-detail-panel">
          <h2>{t("Learning experience")}</h2>
          <ul>
            {program.experiences.map((experience) => (
              <li key={experience}>{t(experience)}</li>
            ))}
          </ul>
        </section>
        <section className="program-detail-panel">
          <h2>{t("Program outcomes")}</h2>
          <ul>
            {program.outcomes.map((outcome) => (
              <li key={outcome}>{t(outcome)}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
