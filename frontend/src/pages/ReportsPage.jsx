import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

function downloadCsv(rows) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "school-finance-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportsPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [studentReport, setStudentReport] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [fees, setFees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const requests = [api.get("/reports/fees")];
    if (user?.role === "ADMIN") {
      requests.push(
        api.get("/reports/students"),
        api.get("/reports/attendance"),
      );
    }
    Promise.all(requests)
      .then((responses) => {
        setFees(responses[0].data.fees);
        if (user?.role === "ADMIN") {
          setStudentReport(responses[1].data.students);
          setAttendanceReport(responses[2].data.attendance);
        }
        setError("");
      })
      .catch(() => setError("Unable to load report data."));
  }, [user?.role]);

  const paid = fees
    .filter((fee) => fee.status === "PAID")
    .reduce((total, fee) => total + Number(fee.amount), 0);
  const outstanding = fees
    .filter((fee) => fee.status !== "PAID")
    .reduce((total, fee) => total + Number(fee.amount), 0);
  const attendanceRate = attendanceReport.length
    ? Math.round(
        (attendanceReport.filter((record) => record.status === "PRESENT")
          .length /
          attendanceReport.length) *
          100,
      )
    : 0;

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Reports")}</span>
          <h2>{t("Performance & Analytics")}</h2>
        </div>
        <button
          className="primary-btn small-btn"
          onClick={() =>
            downloadCsv([
              ["Student", "Fee type", "Amount", "Due date", "Status"],
              ...fees.map((fee) => [
                `${fee.student?.firstName || ""} ${fee.student?.lastName || ""}`,
                fee.feeType,
                fee.amount,
                fee.dueDate,
                fee.status,
              ]),
            ])
          }
        >
          {t("Export CSV")}
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {t(error)}
        </p>
      )}
      <div className="stats-grid summary-grid">
        {user?.role === "ADMIN" && (
          <div className="stat-card">
            <strong>{studentReport.length}</strong>
            <span>{t("Total Students")}</span>
          </div>
        )}
        {user?.role === "ADMIN" && (
          <div className="stat-card">
            <strong>{attendanceRate}%</strong>
            <span>{t("Attendance Rate")}</span>
          </div>
        )}
        <div className="stat-card">
          <strong>${paid.toLocaleString()}</strong>
          <span>{t("Collected payments")}</span>
        </div>
        <div className="stat-card">
          <strong>${outstanding.toLocaleString()}</strong>
          <span>{t("Outstanding fees")}</span>
        </div>
        <div className="stat-card">
          <strong>{fees.length}</strong>
          <span>{t("Fee records")}</span>
        </div>
      </div>
      <section className="panel-box finance-summary">
        <h2>{t("Fee report")}</h2>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>{t("Student")}</th>
                <th>{t("Fee type")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Due date")}</th>
                <th>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    {fee.student?.firstName} {fee.student?.lastName}
                  </td>
                  <td>{t(fee.feeType)}</td>
                  <td>${Number(fee.amount).toLocaleString()}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td>{t(fee.status)}</td>
                </tr>
              ))}
              {!fees.length && (
                <tr>
                  <td colSpan="5">{t("No fee records found.")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {user?.role === "ADMIN" && (
        <div className="card-grid two-col report-panels">
          <section className="panel-box">
            <h2>{t("Attendance summary")}</h2>
            <p>
              {attendanceReport.length} {t("attendance records")}
            </p>
          </section>
          <section className="panel-box">
            <h2>{t("Enrollment summary")}</h2>
            <p>
              {studentReport.length} {t("registered students")}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
