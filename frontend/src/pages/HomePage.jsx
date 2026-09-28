import { useEffect } from "react";
import {
  ArrowRight,
  Building2,
  Users,
  GraduationCap,
  Newspaper,
  MapPin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";
import { programs } from "./programs";

const stats = [
  { label: "Students", value: "2,500+" },
  { label: "Teachers", value: "180+" },
  { label: "Programs", value: "35+" },
  { label: "Success Rate", value: "98%" },
];

export function HomePage() {
  const { t } = useLocale();
  const location = useLocation();

  useEffect(() => {
    if (location.hash !== "#programs") return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("programs")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <div className="page-shell home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">{t("Empowering Excellence")}</span>
          <h1>{t("Where knowledge grows and dreams become reality.")}</h1>
          <p>
            {t(
              "Northfield Academy creates a future-ready learning environment through innovation, academic excellence, and student-centered support.",
            )}
          </p>
          <div className="hero-actions">
            <a href="/login" className="primary-btn">
              {t("Login")} <ArrowRight size={16} />
            </a>
            <a href="#programs" className="secondary-btn">
              {t("Explore Programs")}
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="card-badge">{t("Admissions Open")}</div>
          <ul>
            <li>
              <GraduationCap size={16} /> {t("2025 Academic Year")}
            </li>
            <li>
              <Users size={16} /> {t("2,500+ Students")}
            </li>
            <li>
              <Building2 size={16} /> {t("30+ Modern Labs")}
            </li>
          </ul>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <strong>{item.value}</strong>
            <span>{t(item.label)}</span>
          </div>
        ))}
      </section>

      <section id="programs" className="content-block">
        <div className="section-header">
          <span className="eyebrow">{t("Programs")}</span>
          <h2>{t("Learning pathways for every ambition")}</h2>
        </div>
        <div className="card-grid three-col">
          {programs.map((program) => (
            <Link
              key={program.slug}
              to={`/programs/${program.slug}`}
              className="info-card program-card"
            >
              <img
                className="program-card-image"
                src={program.image}
                alt=""
                loading="lazy"
              />
              <div className="program-card-copy">
                <h3>{t(program.title)}</h3>
                <p>{t(program.details)}</p>
                <span className="program-card-link">
                  {t("Explore program")} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="section-header">
          <span className="eyebrow">{t("Our Faculty")}</span>
          <h2>{t("Experienced teachers who inspire growth")}</h2>
        </div>
        <div className="card-grid three-col">
          {["Ms. Carter", "Mr. Reyes", "Dr. Hassan"].map((teacher) => (
            <div className="profile-card" key={teacher}>
              <div className="avatar">{teacher.split(" ")[1]?.[0] || "T"}</div>
              <h3>{teacher}</h3>
              <p>{t("Senior Faculty")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="section-header">
          <span className="eyebrow">{t("News & Events")}</span>
          <h2>{t("Latest community updates")}</h2>
        </div>
        <div className="card-grid three-col">
          {["Science Fair", "Parents Seminar", "Annual Sports Day"].map(
            (item) => (
              <div className="news-card" key={item}>
                <Newspaper size={28} />
                <h3>{t(item)}</h3>
                <p>
                  {t(
                    "Stay informed with our upcoming school events and achievements.",
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="contact-block">
        <div>
          <span className="eyebrow">{t("Contact")}</span>
          <h2>{t("Let’s build brighter futures together.")}</h2>
        </div>
        <div className="contact-info">
          <div>
            <MapPin size={18} /> 25 Green Valley Road, District 4
          </div>
          <div>hello@northfieldacademy.edu</div>
          <div>+1 (800) 555-0148</div>
        </div>
      </section>
    </div>
  );
}
