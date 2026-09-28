import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

export function ClassesPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    Promise.all([api.get("/classes"), api.get("/teachers")])
      .then(([classResponse, teacherResponse]) => {
        setClasses(classResponse.data);
        setTeachers(teacherResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load classes."));
  }, [reloadKey]);

  const createClass = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    payload.teacherId = payload.teacherId || null;
    setSaving(true);
    setError("");
    try {
      await api.post("/classes", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create class.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Classes")}</span>
          <h2>{t("Class Overview")}</h2>
        </div>
        {user?.role === "ADMIN" && (
          <button
            className="primary-btn small-btn"
            onClick={() => setOpen(true)}
          >
            + {t("Add Class")}
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
              <th>{t("Class ID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Grade")}</th>
              <th>{t("Room")}</th>
              <th>{t("Teacher")}</th>
              <th>{t("Students")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((schoolClass) => (
              <tr key={schoolClass.id}>
                <td>{schoolClass.classId || schoolClass.id}</td>
                <td>{schoolClass.name}</td>
                <td>{schoolClass.grade}</td>
                <td>{schoolClass.room}</td>
                <td>
                  {schoolClass.teacher
                    ? `${schoolClass.teacher.firstName} ${schoolClass.teacher.lastName}`
                    : "-"}
                </td>
                <td>{schoolClass.students?.length || 0}</td>
                <td>
                  <span className="status-pill success">
                    {t(schoolClass.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!classes.length && (
              <tr>
                <td colSpan="7">{t("No classes found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Create class")}
        submitLabel={t("Save class")}
        onClose={() => setOpen(false)}
        onSubmit={createClass}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Class ID")}
          <input name="classId" required />
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Name")}
            <input name="name" required />
          </label>
          <label>
            {t("Grade")}
            <input name="grade" required />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Room")}
            <input name="room" required />
          </label>
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
        </div>
      </FormDialog>
    </div>
  );
}
