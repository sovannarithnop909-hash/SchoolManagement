import { useEffect, useRef, useState } from "react";
import { Camera, UserRound } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : null;

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const prepareProfilePhoto = (file) =>
  new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const size = 384;
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;

        if (!context) throw new Error("Could not prepare the image");

        canvas.width = size;
        canvas.height = size;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, size, size);
        context.drawImage(
          image,
          (size - width) / 2,
          (size - height) / 2,
          width,
          height,
        );
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Could not read the selected image"));
    };
    image.src = imageUrl;
  });

export function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [account, setAccount] = useState(null);
  const [record, setRecord] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const photoInput = useRef(null);

  useEffect(() => {
    let active = true;
    const detailEndpoint =
      user.role === "STUDENT"
        ? "/students/me"
        : user.role === "TEACHER"
          ? "/teachers/me"
          : null;

    const loadProfile = async () => {
      const results = await Promise.allSettled([
        api.get("/auth/profile"),
        detailEndpoint ? api.get(detailEndpoint) : Promise.resolve(null),
      ]);

      if (!active) return;

      if (results[0].status === "fulfilled") {
        setAccount(results[0].value.data.user);
      } else {
        setError(t("Could not load profile information."));
      }

      if (detailEndpoint && results[1].status === "fulfilled") {
        setRecord(results[1].value.data);
      } else if (detailEndpoint) {
        setError(t("Could not load profile information."));
      }

      setLoading(false);
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [user.role, t]);

  const profileType =
    user.role === "STUDENT"
      ? "Student"
      : user.role === "TEACHER"
        ? "Teacher"
        : "Employee";
  const displayName = record
    ? `${record.firstName} ${record.lastName}`.trim()
    : account?.name || user.name;
  const photo =
    account && "profilePhoto" in account
      ? account.profilePhoto
      : record?.profilePhoto;

  const handlePhotoChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError(t("Choose an image file."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError(t("Choose an image smaller than 10 MB."));
      return;
    }

    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const profilePhoto = await prepareProfilePhoto(file);
      const response = await api.put("/auth/profile/photo", { profilePhoto });
      setAccount((current) => ({ ...current, ...response.data }));
      setPhotoFailed(false);
    } catch {
      setPhotoError(t("Could not update profile photo."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const response = await api.put("/auth/profile/photo", {
        profilePhoto: null,
      });
      setAccount((current) => ({ ...current, ...response.data }));
      setRecord((current) =>
        current ? { ...current, profilePhoto: null } : current,
      );
      setPhotoFailed(false);
    } catch {
      setPhotoError(t("Could not update profile photo."));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const detailRows =
    user.role === "STUDENT" && record
      ? [
          ["Student ID", record.studentId],
          ["Gender", record.gender ? t(record.gender) : null],
          ["Date of birth", formatDate(record.dob)],
          ["Phone", record.phone],
          ["Address", record.address],
          ["Parent name", record.parentName],
          ["Parent phone", record.parentPhone],
          ["Class", record.class?.name],
          ["Enrollment date", formatDate(record.enrollmentDate)],
        ]
      : user.role === "TEACHER" && record
        ? [
            ["Teacher ID", record.teacherId],
            ["Gender", record.gender ? t(record.gender) : null],
            ["Date of birth", formatDate(record.dob)],
            ["Phone", record.phone],
            ["Address", record.address],
            ["Subject", record.subject],
            ["Assigned classes", record.classes?.length ?? 0],
            ["Hire date", formatDate(record.hireDate)],
          ]
        : [];

  const rows = [
    ["Email", account?.email],
    ["Role", t(user.role)],
    ["Status", t(record?.status || account?.status)],
    ["Member since", formatDate(account?.createdAt)],
    ...detailRows,
  ].filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  return (
    <div className="page-shell profile-page">
      <header className="section-header profile-page-header">
        <span className="eyebrow">{t(profileType)}</span>
        <h1>{t("My Profile")}</h1>
        <p>{t("Review your account and personal information.")}</p>
      </header>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p aria-live="polite">{t("Loading profile...")}</p>
      ) : (
        <div className="profile-content">
          <section className="profile-identity">
            <div className="profile-avatar">
              {photo && !photoFailed ? (
                <img
                  src={photo}
                  alt={t("Profile photo")}
                  onError={() => setPhotoFailed(true)}
                />
              ) : displayName ? (
                <span>{getInitials(displayName)}</span>
              ) : (
                <UserRound size={32} />
              )}
            </div>
            <div className="profile-identity-copy">
              <h2>{displayName || t(profileType)}</h2>
              <p>{t(profileType)}</p>
            </div>
            <div className="profile-photo-actions">
              <input
                ref={photoInput}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <button
                className="secondary-btn small-btn profile-photo-button"
                type="button"
                disabled={uploadingPhoto}
                onClick={() => photoInput.current?.click()}
              >
                <Camera size={16} />
                {t(uploadingPhoto ? "Uploading photo..." : "Change photo")}
              </button>
              {photo && (
                <button
                  className="profile-photo-remove"
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={handleRemovePhoto}
                >
                  {t("Remove photo")}
                </button>
              )}
              {photoError && (
                <p className="form-error" role="alert">
                  {photoError}
                </p>
              )}
            </div>
          </section>

          <section className="profile-information">
            <h2>{t("Profile information")}</h2>
            {rows.length ? (
              <dl className="profile-details">
                {rows.map(([label, value]) => (
                  <div key={label}>
                    <dt>{t(label)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>{t("Could not load profile information.")}</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
