import { useLocale } from "../context/LocaleContext";

export function NoticesPage() {
  const { t } = useLocale();

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Notices")}</span>
          <h2>{t("School Announcements")}</h2>
        </div>
        <button className="primary-btn small-btn">+ {t("New Notice")}</button>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>{t("Title")}</th>
              <th>{t("Author")}</th>
              <th>{t("Audience")}</th>
              <th>{t("Publish Date")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("Welcome Back")}</td>
              <td>{t("Admin")}</td>
              <td>{t("Everyone")}</td>
              <td>2025-09-01</td>
              <td>
                <span className="status-pill success">{t("Published")}</span>
              </td>
            </tr>
            <tr>
              <td>{t("Parent Orientation")}</td>
              <td>{t("Admin")}</td>
              <td>{t("Parents")}</td>
              <td>2025-09-15</td>
              <td>
                <span className="status-pill warning">{t("Draft")}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
