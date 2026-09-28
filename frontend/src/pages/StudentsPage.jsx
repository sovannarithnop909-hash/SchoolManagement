import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

export function StudentsPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const canCreate = ["ADMIN", "TEACHER"].includes(user?.role);

  useEffect(() => {
    Promise.all([
      api.get("/students"),
      canCreate ? api.get("/classes") : Promise.resolve({ data: [] }),
    ])
      .then(([studentResponse, classResponse]) => {
        setStudents(studentResponse.data);
        setClasses(classResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load students."));
  }, [reloadKey, canCreate]);
  const createStudent = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    const payload = Object.fromEntries(new FormData(form));
    payload.classId = payload.classId || null;
    payload.tuitionAmount = Number(payload.tuitionAmount || 0);
    try {
      await api.post("/students", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create student.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Students")}</span>
          <h2>{t("Student Directory")}</h2>
        </div>
        {canCreate && (
          <button
            className="primary-btn small-btn"
            onClick={() => setOpen(true)}
          >
            + {t("Add Student")}
          </button>
        )}
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
              <th>{t("Student ID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Gender")}</th>
              <th>{t("Email")}</th>
              <th>{t("Class")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.studentId || student.id}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{t(student.gender)}</td>
                <td>{student.email}</td>
                <td>{student.class?.name || "-"}</td>
                <td>
                  <span
                    className={`status-pill ${student.status === "ACTIVE" ? "success" : "warning"}`}
                  >
                    {t(student.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!students.length && (
              <tr>
                <td colSpan="6">{t("No students found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FormDialog
        open={open}
        title={t("Register student")}
        submitLabel={t("Create student account")}
        onClose={() => setOpen(false)}
        onSubmit={createStudent}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Student ID")}
          <input name="studentId" required />
        </label>
        <div className="form-grid two-col">
          <label>
            {t("First name")}
            <input name="firstName" required />
          </label>
          <label>
            {t("Last name")}
            <input name="lastName" required />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Gender")}
            <select name="gender" required>
              <option value="FEMALE">{t("Female")}</option>
              <option value="MALE">{t("Male")}</option>
              <option value="OTHER">{t("Other")}</option>
            </select>
          </label>
          <label>
            {t("Date of birth")}
            <input type="date" name="dob" />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Email")}
            <input type="email" name="email" required />
          </label>
          <label>
            {t("Initial password")}
            <input type="password" name="password" minLength="8" required />
          </label>
        </div>
        <label>
          {t("Class")}
          <select name="classId">
            <option value="">{t("Unassigned")}</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Phone")}
            <input name="phone" />
          </label>
          <label>
            {t("Enrollment date")}
            <input type="date" name="enrollmentDate" required />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Parent name")}
            <input name="parentName" />
          </label>
          <label>
            {t("Parent phone")}
            <input name="parentPhone" />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Initial tuition fee")}
            <input
              type="number"
              name="tuitionAmount"
              min="0"
              step="0.01"
              defaultValue="0"
            />
          </label>
          <label>
            {t("Fee due date")}
            <input type="date" name="feeDueDate" />
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
