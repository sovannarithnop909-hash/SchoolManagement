import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "../api/client";
import { useLocale } from "../context/LocaleContext";

export function AttendanceScanPage() {
  const { t } = useLocale();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scannerKey, setScannerKey] = useState(0);

  useEffect(() => {
    let active = true;
    const scanner = new Html5QrcodeScanner(
      "attendance-qr-reader",
      {
        fps: 8,
        qrbox: { width: 240, height: 240 },
        rememberLastUsedCamera: true,
      },
      false,
    );

    scanner.render(
      async (token) => {
        scanner.pause(true);
        setError("");
        try {
          const response = await api.post("/attendance/scan", { token });
          if (active) {
            const { record, type } = response.data;
            const name =
              type === "TEACHER"
                ? `${record.teacher.firstName} ${record.teacher.lastName}`
                : `${record.student.firstName} ${record.student.lastName}`;
            setResult({
              name,
              type,
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        } catch (requestError) {
          if (active) {
            setError(
              requestError.response?.data?.message ||
                t("Could not record this QR check-in."),
            );
          }
        } finally {
          if (active) window.setTimeout(() => scanner.resume(), 1800);
        }
      },
      () => {},
    );

    return () => {
      active = false;
      scanner.clear().catch(() => {});
    };
  }, [scannerKey, t]);

  return (
    <div className="page-shell qr-scan-page">
      <div className="section-header">
        <span className="eyebrow">{t("Attendance")}</span>
        <h1>{t("Scan attendance QR")}</h1>
        <p>
          {t(
            "Scan a student's or teacher's current QR code to record today's check-in.",
          )}
        </p>
      </div>
      <div className="qr-scan-layout">
        <section className="panel-box scanner-panel">
          <div id="attendance-qr-reader" key={scannerKey} />
          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              setResult(null);
              setError("");
              setScannerKey((key) => key + 1);
            }}
          >
            {t("Restart scanner")}
          </button>
        </section>
        <section className="panel-box scan-result" aria-live="polite">
          <h2>{result ? t("Check-in recorded") : t("Ready to scan")}</h2>
          {result ? (
            <>
              <p className="scan-success">{result.name}</p>
              <p>
                {t(result.type)} · {result.timestamp}
              </p>
            </>
          ) : (
            <p>
              {t(
                "The camera will record attendance after a valid QR code is scanned.",
              )}
            </p>
          )}
          {error && (
            <p className="form-error" role="alert">
              {t(error)}
            </p>
          )}
          <Link className="secondary-btn" to="/attendance">
            {t("View attendance log")}
          </Link>
        </section>
      </div>
    </div>
  );
}
