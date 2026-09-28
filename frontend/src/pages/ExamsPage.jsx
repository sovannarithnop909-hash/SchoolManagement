import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useLocale } from "../context/LocaleContext";

export function ExamsPage() {
  const { t } = useLocale();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    Promise.all([api.get("/exams"), api.get("/classes")])
      .then(([examResponse, classResponse]) => {
        setExams(examResponse.data);
        setClasses(classResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load exams."));
  }, [reloadKey]);

  const createExam = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    payload.classId = payload.classId || null;
    setSaving(true);
    setError("");
    try {
      await api.post("/exams", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create exam.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Exams & Grades")}</span>
          <h2>{t("Assessment Center")}</h2>
        </div>
        <button className="primary-btn small-btn" onClick={() => setOpen(true)}>
          + {t("Add Exam")}
        </button>
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
              <th>{t("Exam ID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Type")}</th>
              <th>{t("Class")}</th>
              <th>{t("Start date")}</th>
              <th>{t("End date")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.examId || exam.id}</td>
                <td>{exam.name}</td>
                <td>{t(exam.type)}</td>
                <td>{exam.class?.name || "-"}</td>
                <td>{new Date(exam.startDate).toLocaleDateString()}</td>
                <td>{new Date(exam.endDate).toLocaleDateString()}</td>
                <td>
                  <span className="status-pill">{t(exam.status)}</span>
                </td>
              </tr>
            ))}
            {!exams.length && (
              <tr>
                <td colSpan="7">{t("No exams found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Create exam")}
        submitLabel={t("Save exam")}
        onClose={() => setOpen(false)}
        onSubmit={createExam}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Exam ID")}
          <input name="examId" required />
        </label>
        <label>
          {t("Name")}
          <input name="name" required />
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Type")}
            <select name="type">
              <option value="MIDTERM">{t("Midterm")}</option>
              <option value="FINAL">{t("Final")}</option>
              <option value="MONTHLY">{t("Monthly")}</option>
              <option value="QUIZ">{t("Quiz")}</option>
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
        <div className="form-grid two-col">
          <label>
            {t("Start date")}
            <input name="startDate" type="date" required />
          </label>
          <label>
            {t("End date")}
            <input name="endDate" type="date" required />
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
