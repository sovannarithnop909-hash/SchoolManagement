import { useEffect, useState } from "react";
import { api } from "../api/client";
import { FormDialog } from "../components/FormDialog";
import { useLocale } from "../context/LocaleContext";

export function FeesPage() {
  const { t } = useLocale();
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dialog, setDialog] = useState("");
  const [selectedFeeId, setSelectedFeeId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    Promise.all([api.get("/fees"), api.get("/students"), api.get("/payments")])
      .then(([feeResponse, studentResponse, paymentResponse]) => {
        setFees(feeResponse.data);
        setStudents(studentResponse.data);
        setPayments(paymentResponse.data);
        setLoadError("");
      })
      .catch(() => setLoadError("Unable to load finance records."));
  }, [reloadKey]);

  const selectedFee = fees.find((fee) => String(fee.id) === selectedFeeId);
  const closeDialog = () => {
    setDialog("");
    setError("");
    setSelectedFeeId("");
    setPaymentAmount("");
  };

  const saveFinanceRecord = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    setSaving(true);
    setError("");
    try {
      if (dialog === "fee") {
        payload.studentId = Number(payload.studentId);
        payload.amount = Number(payload.amount);
        await api.post("/fees", payload);
      } else {
        payload.studentId = Number(payload.studentId);
        payload.feeRecordId = Number(payload.feeRecordId);
        payload.amount = Number(payload.amount);
        await api.post("/payments", payload);
      }
      closeDialog();
      form.reset();
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to save finance record.",
      );
    } finally {
      setSaving(false);
    }
  };

  const collected = payments
    .filter((payment) => payment.status === "SUCCESS")
    .reduce((total, payment) => total + Number(payment.amount), 0);
  const outstanding = fees
    .filter((fee) => fee.status !== "PAID")
    .reduce((total, fee) => total + Number(fee.amount), 0);

  return (
    <div className="page-shell">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Fees")}</span>
          <h2>{t("Fee Management")}</h2>
        </div>
        <div className="role-actions">
          <button
            className="secondary-btn small-btn"
            onClick={() => setDialog("fee")}
          >
            + {t("Create fee")}
          </button>
          <button
            className="primary-btn small-btn"
            onClick={() => setDialog("payment")}
          >
            + {t("Record Payment")}
          </button>
        </div>
      </div>
      {loadError && (
        <p className="form-error" role="alert">
          {t(loadError)}
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
      <div className="table-card responsive-table">
        <table>
          <thead>
            <tr>
              <th>{t("Fee ID")}</th>
              <th>{t("Student")}</th>
              <th>{t("Type")}</th>
              <th>{t("Amount")}</th>
              <th>{t("Due date")}</th>
              <th>{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id}>
                <td>{fee.feeId || `FEE-${String(fee.id).padStart(4, "0")}`}</td>
                <td>
                  {fee.student?.firstName} {fee.student?.lastName}
                </td>
                <td>{t(fee.feeType)}</td>
                <td>${Number(fee.amount).toLocaleString()}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-pill ${fee.status === "PAID" ? "success" : "warning"}`}
                  >
                    {t(fee.status)}
                  </span>
                </td>
              </tr>
            ))}
            {!fees.length && (
              <tr>
                <td colSpan="6">{t("No fee records found.")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <section className="panel-box finance-summary">
        <h2>{t("Recent payments")}</h2>
        {payments.slice(0, 8).map((payment) => (
          <article className="class-row" key={payment.id}>
            <div>
              <strong>
                {payment.student?.firstName} {payment.student?.lastName}
              </strong>
              <span>
                {payment.feeRecord?.feeType
                  ? t(payment.feeRecord.feeType)
                  : t(payment.paymentMethod)}{" "}
                · {new Date(payment.paymentDate).toLocaleDateString()}
              </span>
            </div>
            <strong>${Number(payment.amount).toLocaleString()}</strong>
          </article>
        ))}
        {!payments.length && <p>{t("No payments have been recorded yet.")}</p>}
      </section>

      <FormDialog
        open={dialog === "fee"}
        title={t("Create fee")}
        submitLabel={t("Save fee")}
        onClose={closeDialog}
        onSubmit={saveFinanceRecord}
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
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </label>
        <div className="form-grid two-col">
          <label>
            {t("Fee type")}
            <select name="feeType">
              <option value="TUITION">{t("Tuition")}</option>
              <option value="REGISTRATION">{t("Registration")}</option>
              <option value="LIBRARY">{t("Library")}</option>
              <option value="TRANSPORTATION">{t("Transportation")}</option>
              <option value="UNIFORM">{t("Uniform")}</option>
              <option value="OTHER">{t("Other")}</option>
            </select>
          </label>
          <label>
            {t("Amount")}
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
            />
          </label>
        </div>
        <label>
          {t("Due date")}
          <input name="dueDate" type="date" required />
        </label>
      </FormDialog>

      <FormDialog
        open={dialog === "payment"}
        title={t("Record Payment")}
        submitLabel={t("Save payment")}
        onClose={closeDialog}
        onSubmit={saveFinanceRecord}
        error={t(error)}
        saving={saving}
      >
        <label>
          {t("Fee record")}
          <select
            name="feeRecordId"
            required
            value={selectedFeeId}
            onChange={(event) => {
              const fee = fees.find(
                (record) => String(record.id) === event.target.value,
              );
              setSelectedFeeId(event.target.value);
              setPaymentAmount(fee ? String(fee.amount) : "");
            }}
          >
            <option value="" disabled>
              {t("Select a fee")}
            </option>
            {fees
              .filter((fee) => fee.status !== "PAID")
              .map((fee) => (
                <option key={fee.id} value={fee.id}>
                  {fee.student?.firstName} {fee.student?.lastName} ·{" "}
                  {t(fee.feeType)} · ${Number(fee.amount).toLocaleString()}
                </option>
              ))}
          </select>
        </label>
        <input
          type="hidden"
          name="studentId"
          value={selectedFee?.studentId || ""}
        />
        <div className="form-grid two-col">
          <label>
            {t("Amount")}
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(event.target.value)}
            />
          </label>
          <label>
            {t("Payment date")}
            <input name="paymentDate" type="date" required />
          </label>
        </div>
        <div className="form-grid two-col">
          <label>
            {t("Payment method")}
            <select name="paymentMethod">
              <option value="CASH">{t("Cash")}</option>
              <option value="BANK_TRANSFER">{t("Bank transfer")}</option>
              <option value="CARD">{t("Card")}</option>
              <option value="ONLINE_PAYMENT">{t("Online payment")}</option>
            </select>
          </label>
          <label>
            {t("Reference number")}
            <input name="referenceNumber" />
          </label>
        </div>
      </FormDialog>
    </div>
  );
}
