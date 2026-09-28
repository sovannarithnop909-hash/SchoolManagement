import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useLocale } from "../context/LocaleContext";

export function UsersPage() {
  const { t } = useLocale();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => {
        setUsers(response.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load users."));
  }, [reloadKey]);

  const createUser = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setSaving(true);
    setError("");
    try {
      await api.post("/users", payload);
      setOpen(false);
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to create user.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Users")}</span>
          <h2>{t("User Administration")}</h2>
        </div>
        <button className="primary-btn small-btn" onClick={() => setOpen(true)}>
          + {t("Create User")}
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
              <th>{t("Name")}</th>
              <th>{t("Email")}</th>
              <th>{t("Role")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{t(account.role)}</td>
                <td>
                  <span
                    className={`status-pill ${account.status === "ACTIVE" ? "success" : "warning"}`}
                  >
                    {t(account.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr>
                <td colSpan="4">{t("No users found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FormDialog
        open={open}
        title={t("Create User")}
        submitLabel={t("Create User")}
        onClose={() => setOpen(false)}
        onSubmit={createUser}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Name")}
          <input name="name" required />
        </label>
        <label>
          {t("Email")}
          <input name="email" type="email" required />
        </label>
        <label>
          {t("Initial password")}
          <input name="password" type="password" minLength="8" required />
        </label>
        <label>
          {t("Role")}
          <select name="role">
            <option value="ACCOUNTANT">{t("ACCOUNTANT")}</option>
            <option value="ADMIN">{t("ADMIN")}</option>
          </select>
        </label>
      </FormDialog>
    </div>
  );
}
