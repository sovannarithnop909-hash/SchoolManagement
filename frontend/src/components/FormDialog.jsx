import { X } from "lucide-react";
import { useLocale } from "../context/LocaleContext";

export function FormDialog({
  open,
  title,
  submitLabel,
  onClose,
  onSubmit,
  error,
  saving,
  children,
}) {
  const { t } = useLocale();
  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="dialog-header">
          <h2 id="dialog-title">{title}</h2>
          <button
            className="icon-button"
            type="button"
            aria-label={t("Close")}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <form onSubmit={onSubmit}>
          <div className="dialog-fields">{children}</div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <footer className="dialog-actions">
            <button className="secondary-btn" type="button" onClick={onClose}>
              {t("Cancel")}
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? t("Saving...") : submitLabel}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
