import { Link } from "react-router-dom";
import { useLocale } from "../context/LocaleContext";

export function NotFoundPage() {
  const { t } = useLocale();

  return (
    <div className="page-shell error-page">
      <h1>404</h1>
      <p>{t("The page you are looking for does not exist.")}</p>
      <Link to="/" className="primary-btn">
        {t("Back Home")}
      </Link>
    </div>
  );
}
