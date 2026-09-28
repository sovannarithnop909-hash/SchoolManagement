import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLocale } from "../context/LocaleContext";

export function StudentFeesPage() {
  const { t } = useLocale();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/students/me")
      .then((response) => setProfile(response.data))
      .catch(() => setError("Unable to load your fee records."));
  }, []);

  const totalDue =
    profile?.fees
      ?.filter((fee) => fee.status !== "PAID")
      .reduce((total, fee) => total + Number(fee.amount), 0) || 0;

  return (
    <div className="page-shell">
      <div className="section-header">
        <span className="eyebrow">{t("Student portal")}</span>
        <h1>{t("My fees and payments")}</h1>
        <p>{t("Review your tuition charges and payment history.")}</p>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {t(error)}
        </p>
      )}
      <div className="stats-grid summary-grid">
        <div className="stat-card">
          <strong>${totalDue.toLocaleString()}</strong>
          <span>{t("Outstanding balance")}</span>
        </div>
        <div className="stat-card">
          <strong>{profile?.fees?.length || 0}</strong>
          <span>{t("Fee records")}</span>
        </div>
      </div>
      <section className="panel-box finance-summary">
        <h2>{t("Tuition and fees")}</h2>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>{t("Fee type")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Due date")}</th>
                <th>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {profile?.fees?.map((fee) => (
                <tr key={fee.id}>
                  <td>{t(fee.feeType)}</td>
                  <td>${Number(fee.amount).toLocaleString()}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td>{t(fee.status)}</td>
                </tr>
              ))}
              {!profile?.fees?.length && (
                <tr>
                  <td colSpan="4">{t("No fee records found.")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel-box finance-summary">
        <h2>{t("Payment history")}</h2>
        {profile?.payments?.map((payment) => (
          <article className="class-row" key={payment.id}>
            <div>
              <strong>{t(payment.paymentMethod)}</strong>
              <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
            <strong>${Number(payment.amount).toLocaleString()}</strong>
          </article>
        ))}
        {!profile?.payments?.length && (
          <p>{t("No payments have been recorded yet.")}</p>
        )}
      </section>
    </div>
  );
}
