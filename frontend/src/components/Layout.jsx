import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BarChart3,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocale } from "../context/LocaleContext";
import { roleHome } from "../utils/roles";

const navItemsByRole = {
  ADMIN: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Students", to: "/students" },
    { label: "Teachers", to: "/teachers" },
    { label: "Classes", to: "/classes" },
    { label: "Subjects", to: "/subjects" },
    { label: "Exams & Grades", to: "/exams" },
    { label: "Attendance", to: "/attendance" },
    { label: "Fees", to: "/fees" },
    { label: "Notices", to: "/notices" },
    { label: "Reports", to: "/reports" },
    { label: "Users", to: "/users" },
    { label: "My Profile", to: "/profile" },
  ],
  TEACHER: [
    { label: "Teacher workspace", to: "/teacher" },
    { label: "Students", to: "/students" },
    { label: "Classes", to: "/classes" },
    { label: "Exams & Grades", to: "/exams" },
    { label: "Attendance", to: "/attendance" },
    { label: "Notices", to: "/notices" },
    { label: "My Profile", to: "/profile" },
  ],
  STUDENT: [
    { label: "Student portal", to: "/student" },
    { label: "My fees and payments", to: "/student/fees" },
    { label: "Notices", to: "/notices" },
    { label: "My Profile", to: "/profile" },
  ],
  ACCOUNTANT: [
    { label: "Finance office", to: "/accounting" },
    { label: "Students", to: "/students" },
    { label: "Fees", to: "/fees" },
    { label: "Reports", to: "/reports" },
    { label: "My Profile", to: "/profile" },
  ],
};

export function Layout() {
  const { user, logout } = useAuth();
  const { language, setLanguage, theme, setTheme, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const page = document.querySelector(".page-shell");
    if (!page || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    Array.from(page.children).forEach((section, index) => {
      section.classList.add("scroll-reveal");
      section.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, 4) * 70}ms`,
      );
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className={`topbar${mobileNavOpen ? " navigation-open" : ""}`}>
        <div className="brand-wrap">
          {user && (
            <button
              className="mobile-menu"
              type="button"
              aria-label={
                mobileNavOpen ? t("Close navigation") : t("Open navigation")
              }
              aria-expanded={mobileNavOpen}
              aria-controls="dashboard-sidebar"
              onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="brand-title">Northfield Academy</div>
            <div className="brand-subtitle">{t("School Management")}</div>
          </div>
        </div>

        <div className="toolbar-controls">
          <label className="language-control">
            <span className="sr-only">{t("Language")}</span>
            <select
              className="language-select"
              aria-label={t("Language")}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="km">ភាសាខ្មែរ</option>
            </select>
          </label>
          <button
            className="theme-toggle"
            type="button"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav className="top-links">
          <NavLink to="/">{t("Home")}</NavLink>
          {user ? (
            <>
              <NavLink to={roleHome[user.role] || "/dashboard"}>
                {t("Dashboard")}
              </NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={15} /> {t("Logout")}
              </button>
            </>
          ) : (
            <NavLink to="/login">{t("Login")}</NavLink>
          )}
        </nav>
      </header>

      {!user ? (
        <Outlet />
      ) : (
        <div className="dashboard-layout">
          {mobileNavOpen && (
            <button
              className="sidebar-backdrop"
              type="button"
              aria-label={t("Close navigation")}
              onClick={() => setMobileNavOpen(false)}
            />
          )}
          <aside
            id="dashboard-sidebar"
            className={`sidebar${mobileNavOpen ? " is-open" : ""}`}
          >
            <div className="sidebar-header">
              <div className="sidebar-icon">
                <BarChart3 size={22} />
              </div>
              <div>
                <h3>
                  {t(
                    user.role === "TEACHER"
                      ? "Teacher workspace"
                      : user.role === "STUDENT"
                        ? "Student portal"
                        : user.role === "ACCOUNTANT"
                          ? "Finance office"
                          : "Admin Portal",
                  )}
                </h3>
                <p>{t(user?.role || "Admin")}</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {(navItemsByRole[user.role] || []).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "nav-item active" : "nav-item"
                  }
                >
                  {t(item.label)}
                </NavLink>
              ))}
              <button className="nav-item logout-side" onClick={handleLogout}>
                <LogOut size={16} /> {t("Logout")}
              </button>
            </nav>
          </aside>

          <main className="content-area">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}
