import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../api/client";
import { useLocale } from "../context/LocaleContext";

function AttendanceQrCard() {
  const { t } = useLocale();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refreshToken = async () => {
      try {
        const response = await api.get("/attendance/qr-token");
        if (active) {
          setToken(response.data.token);
          setError("");
        }
      } catch {
        if (active) setError(t("Unable to load attendance QR code."));
      }
    };

    refreshToken();
    const interval = window.setInterval(refreshToken, 4 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [t]);

  return (
    <section className="panel-box qr-panel">
      <div>
        <span className="eyebrow">{t("Attendance")}</span>
        <h2>{t("My attendance QR")}</h2>
        <p>{t("Show this code to an authorized staff member to check in.")}</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
      {token ? (
        <div className="qr-code-frame">
          <QRCodeSVG value={token} size={176} level="M" includeMargin />
        </div>
      ) : (
        <div
          className="qr-code-placeholder"
          aria-label={t("Loading QR code")}
        />
      )}
    </section>
  );
}

export function TeacherDashboardPage() {
  const { t } = useLocale();
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/teachers/me")
      .then((response) => setTeacher(response.data))
      .catch(() => setError(t("Unable to load your teacher profile.")));
  }, [t]);

  const classCount = teacher?.classes?.length || 0;
  const studentCount =
    teacher?.classes?.reduce(
      (total, schoolClass) => total + (schoolClass.students?.length || 0),
      0,
    ) || 0;
  const teacherCheckIns = teacher?.attendanceRecords || [];

  return (
    <div className="page-shell role-dashboard">
      <div className="section-header">
        <span className="eyebrow">{t("Teacher workspace")}</span>
        <h1>
          {t("Welcome")}
          {teacher ? `, ${teacher.firstName}` : ""}
        </h1>
        <p>{t("Manage your classes, assessments, and daily attendance.")}</p>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="stats-grid summary-grid">
        <div className="stat-card">
          <strong>{classCount}</strong>
          <span>{t("My classes")}</span>
        </div>
        <div className="stat-card">
          <strong>{studentCount}</strong>
          <span>{t("Students in my classes")}</span>
        </div>
        <div className="stat-card">
          <strong>{teacherCheckIns.length}</strong>
          <span>{t("Teacher check-ins")}</span>
        </div>
        <Link className="stat-card quick-action" to="/attendance/scan">
          <strong>{t("Scan QR")}</strong>
          <span>{t("Record student or teacher check-in")}</span>
        </Link>
        <Link className="stat-card quick-action" to="/exams">
          <strong>{t("Assessments")}</strong>
          <span>{t("Create and review exams")}</span>
        </Link>
      </div>
      <div className="card-grid two-col">
        <section className="panel-box">
          <h2>{t("My classes")}</h2>
          {teacher?.classes?.length ? (
            <div className="class-list">
              {teacher.classes.map((schoolClass) => (
                <article className="class-row" key={schoolClass.id}>
                  <div>
                    <strong>{schoolClass.name}</strong>
                    <span>
                      {t("Room")} {schoolClass.room}
                    </span>
                  </div>
                  <span>
                    {schoolClass.students?.length || 0} {t("Students")}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p>{t("Your assigned classes will appear here.")}</p>
          )}
        </section>
        <AttendanceQrCard />
      </div>
      <section className="panel-box finance-summary">
        <h2>{t("My check-in history")}</h2>
        {teacherCheckIns.map((record) => (
          <article className="class-row" key={record.id}>
            <strong>
              {new Date(record.attendanceDate).toLocaleDateString()}
            </strong>
            <span>
              {t(record.status)} ·{" "}
              {new Date(record.checkInAt).toLocaleTimeString()}
            </span>
          </article>
        ))}
        {!teacherCheckIns.length && (
          <p>{t("No teacher check-ins recorded yet.")}</p>
        )}
      </section>
      <div className="role-actions">
        <Link className="primary-btn" to="/attendance">
          {t("Take attendance")}
        </Link>
        <Link className="secondary-btn" to="/students">
          {t("Student roster")}
        </Link>
        <Link className="secondary-btn" to="/classes">
          {t("Class schedule")}
        </Link>
      </div>
    </div>
  );
}

export function StudentDashboardPage() {
  const { t } = useLocale();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/students/me")
      .then((response) => setStudent(response.data))
      .catch(() => setError(t("Unable to load your student profile.")));
  }, [t]);

  const latestAttendance = student?.attendance?.slice(0, 5) || [];
  const latestGrades = student?.grades?.slice(0, 5) || [];

  return (
    <div className="page-shell role-dashboard">
      <div className="section-header">
        <span className="eyebrow">{t("Student portal")}</span>
        <h1>
          {t("Welcome")}
          {student ? `, ${student.firstName}` : ""}
        </h1>
        <p>
          {t("Your learning, attendance, and fee information in one place.")}
        </p>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="stats-grid summary-grid">
        <div className="stat-card">
          <strong>{student?.class?.name || "-"}</strong>
          <span>{t("My class")}</span>
        </div>
        <div className="stat-card">
          <strong>
            {student?.attendance?.filter((item) => item.status === "PRESENT")
              .length || 0}
          </strong>
          <span>{t("Days present")}</span>
        </div>
        <Link className="stat-card quick-action" to="/student/fees">
          <strong>{student?.fees?.length || 0}</strong>
          <span>{t("My fee records")}</span>
        </Link>
      </div>
      <div className="card-grid two-col">
        <AttendanceQrCard />
        <section className="panel-box">
          <h2>{t("Recent attendance")}</h2>
          {latestAttendance.length ? (
            latestAttendance.map((record) => (
              <article className="class-row" key={record.id}>
                <strong>
                  {new Date(record.attendanceDate).toLocaleDateString()}
                </strong>
                <span>{t(record.status)}</span>
              </article>
            ))
          ) : (
            <p>{t("No attendance has been recorded yet.")}</p>
          )}
        </section>
      </div>
      <section className="panel-box grade-panel">
        <h2>{t("Recent grades")}</h2>
        {latestGrades.length ? (
          latestGrades.map((record) => (
            <article className="class-row" key={record.id}>
              <strong>{record.subject?.name || t("Subject")}</strong>
              <span>
                {record.grade} · {record.score}
              </span>
            </article>
          ))
        ) : (
          <p>
            {t("Your grades will appear here after your teachers enter them.")}
          </p>
        )}
      </section>
    </div>
  );
}

export function AccountantDashboardPage() {
  const { t } = useLocale();
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/fees"), api.get("/payments")])
      .then(([feeResponse, paymentResponse]) => {
        setFees(feeResponse.data);
        setPayments(paymentResponse.data);
      })
      .catch(() => setError(t("Unable to load finance records.")));
  }, [t]);

  const outstanding = fees
    .filter((fee) => fee.status !== "PAID")
    .reduce((total, fee) => total + Number(fee.amount), 0);
  const collected = payments
    .filter((payment) => payment.status === "SUCCESS")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  return (
    <div className="page-shell role-dashboard">
      <div className="section-header">
        <span className="eyebrow">{t("Finance office")}</span>
        <h1>{t("Fee and payment management")}</h1>
        <p>
          {t("Track enrollment charges, payments, and outstanding balances.")}
        </p>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="stats-grid summary-grid">
        <div className="stat-card">
          <strong>${collected.toLocaleString()}</strong>
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
        <div className="stat-card">
          <strong>{payments.length}</strong>
          <span>{t("Payment transactions")}</span>
        </div>
      </div>
      <div className="role-actions">
        <Link className="primary-btn" to="/fees">
          {t("Manage tuition and fees")}
        </Link>
        <Link className="secondary-btn" to="/reports">
          {t("Financial reports")}
        </Link>
        <Link className="secondary-btn" to="/students">
          {t("Enrollment roster")}
        </Link>
      </div>
      <section className="panel-box finance-summary">
        <h2>{t("Recent payments")}</h2>
        {payments.slice(0, 6).map((payment) => (
          <article className="class-row" key={payment.id}>
            <div>
              <strong>
                {payment.student?.firstName} {payment.student?.lastName}
              </strong>
              <span>{new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
            <strong>${Number(payment.amount).toLocaleString()}</strong>
          </article>
        ))}
        {!payments.length && <p>{t("No payments have been recorded yet.")}</p>}
      </section>
    </div>
  );
}
