import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

export function AttendancePage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get("/attendance"),
      api.get("/students"),
      api.get("/classes"),
    ])
      .then(([attendanceResponse, studentResponse, classResponse]) => {
        setRecords(attendanceResponse.data);
        setStudents(studentResponse.data);
        setClasses(classResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load attendance records."));
  }, [reloadKey]);

  const canEdit = ["ADMIN", "TEACHER"].includes(user?.role);
  const createAttendance = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setSaving(true);
    setError("");
    try {
      await api.post("/attendance", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to record attendance.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Attendance")}</span>
          <h2>{t("Student Attendance")}</h2>
        </div>
        <div className="role-actions">
          <Link className="secondary-btn small-btn" to="/attendance/scan">
            {t("Scan QR")}
          </Link>
          {canEdit && (
            <button
              className="primary-btn small-btn"
              onClick={() => setOpen(true)}
            >
              {t("Mark Attendance")}
            </button>
          )}
        </div>
      </div>
      {loadError && (
        <p className="form-error" role="alert">
          {t(loadError)}
        </p>
      )}
      <div className="table-card responsive-table">
        <table>
          <thead>
            <tr>
              <th>{t("Student")}</th>
              <th>{t("Date")}</th>
              <th>{t("Class")}</th>
              <th>{t("Status")}</th>
              <th>{t("Remark")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  {record.student?.firstName} {record.student?.lastName}
                </td>
                <td>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                <td>{record.class?.name || "-"}</td>
                <td>
                  <span
                    className={`status-pill ${record.status === "PRESENT" ? "success" : record.status === "ABSENT" ? "danger" : "warning"}`}
                  >
                    {t(record.status)}
                  </span>
                </td>
                <td>{record.remark || "-"}</td>
              </tr>
            ))}
            {!records.length && (
              <tr>
                <td colSpan="5">{t("No attendance records found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Mark Attendance")}
        submitLabel={t("Save attendance")}
        onClose={() => setOpen(false)}
        onSubmit={createAttendance}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Student")}
          <select name="studentId" required defaultValue="">
            <option value="" disabled>
              {t("Select a student")}
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ·{" "}
                {student.studentId || student.id}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Class")}
            <select name="classId" required defaultValue="">
              <option value="" disabled>
                {t("Select a class")}
              </option>
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Date")}
            <input name="attendanceDate" type="date" required />
          </label>
        </div>
        <label>
          {t("Status")}
          <select name="status">
            <option value="PRESENT">{t("Present")}</option>
            <option value="ABSENT">{t("Absent")}</option>
            <option value="LATE">{t("Late")}</option>
            <option value="EXCUSED">{t("Excused")}</option>
          </select>
        </label>
        <label>
          {t("Remark")}
          <input name="remark" />
        </label>
      </FormDialog>
    </div>
  );
}
