import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

export function SubjectsPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get("/subjects"),
      api.get("/teachers"),
      api.get("/classes"),
    ])
      .then(([subjectResponse, teacherResponse, classResponse]) => {
        setSubjects(subjectResponse.data);
        setTeachers(teacherResponse.data);
        setClasses(classResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load subjects."));
  }, [reloadKey]);

  const createSubject = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    payload.teacherId = payload.teacherId || null;
    payload.classId = payload.classId || null;
    payload.credits = Number(payload.credits || 1);
    setSaving(true);
    setError("");
    try {
      await api.post("/subjects", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create subject.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Subjects")}</span>
          <h2>{t("Subject Catalog")}</h2>
        </div>
        {user?.role && ["ADMIN", "TEACHER"].includes(user.role) && (
          <button
            className="primary-btn small-btn"
            onClick={() => setOpen(true)}
          >
            + {t("Add Subject")}
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
              <th>{t("Subject ID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Code")}</th>
              <th>{t("Teacher")}</th>
              <th>{t("Class")}</th>
              <th>{t("Credits")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.subjectId || subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
                <td>
                  {subject.teacher
                    ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                    : "-"}
                </td>
                <td>{subject.class?.name || "-"}</td>
                <td>{subject.credits}</td>
                <td>
                  <span className="status-pill success">
                    {t(subject.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!subjects.length && (
              <tr>
                <td colSpan="7">{t("No subjects found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Create subject")}
        submitLabel={t("Save subject")}
        onClose={() => setOpen(false)}
        onSubmit={createSubject}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Subject ID")}
          <input name="subjectId" required />
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Name")}
            <input name="name" required />
          </label>
          <label>
            {t("Code")}
            <input name="code" required />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Teacher")}
            <select name="teacherId">
              <option value="">{t("Unassigned")}</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </label>
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
        </div>
        <label>
          {t("Credits")}
          <input name="credits" type="number" min="1" defaultValue="1" />
        </label>
      </FormDialog>
    </div>
  );
}
