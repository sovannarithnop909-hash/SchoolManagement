import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

export function TeachersPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api
      .get("/teachers")
      .then((response) => {
        setTeachers(response.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load teachers."));
  }, [reloadKey]);

  const createTeacher = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setSaving(true);
    setError("");
    try {
      await api.post("/teachers", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create teacher.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Teachers")}</span>
          <h2>{t("Faculty Management")}</h2>
        </div>
        {user?.role === "ADMIN" && (
          <button
            className="primary-btn small-btn"
            onClick={() => setOpen(true)}
          >
            + {t("Add Teacher")}
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
              <th>{t("Teacher ID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Subject")}</th>
              <th>{t("Email")}</th>
              <th>{t("Phone")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.teacherId || teacher.id}</td>
                <td>
                  {teacher.firstName} {teacher.lastName}
                </td>
                <td>{teacher.subject}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone || "-"}</td>
                <td>
                  <span
                    className={`status-pill ${teacher.status === "ACTIVE" ? "success" : "warning"}`}
                  >
                    {t(teacher.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!teachers.length && (
              <tr>
                <td colSpan="6">{t("No teachers found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Register teacher")}
        submitLabel={t("Create teacher account")}
        onClose={() => setOpen(false)}
        onSubmit={createTeacher}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Teacher ID")}
          <input name="teacherId" required />
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
            <select name="gender">
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
        <div className="form-grid two-col">
          <label>
            {t("Subject")}
            <input name="subject" required />
          </label>
          <label>
            {t("Hire date")}
            <input type="date" name="hireDate" required />
          </label>
        </div>
        <label>
          {t("Phone")}
          <input name="phone" />
        </label>
      </FormDialog>
    </div>
  );
}
