import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProgramPage } from "./pages/ProgramPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/RoleDashboards").then((module) => ({
    default: module.TeacherDashboardPage,
  })),
);
const StudentDashboardPage = lazy(() =>
  import("./pages/RoleDashboards").then((module) => ({
    default: module.StudentDashboardPage,
  })),
);
const AccountantDashboardPage = lazy(() =>
  import("./pages/RoleDashboards").then((module) => ({
    default: module.AccountantDashboardPage,
  })),
);
import { StudentsPage } from "./pages/StudentsPage";
import { TeachersPage } from "./pages/TeachersPage";
import { ClassesPage } from "./pages/ClassesPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { ExamsPage } from "./pages/ExamsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { FeesPage } from "./pages/FeesPage";
import { StudentFeesPage } from "./pages/StudentFeesPage";
import { NoticesPage } from "./pages/NoticesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { UsersPage } from "./pages/UsersPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { LocaleProvider } from "./context/LocaleContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const AttendanceScanPage = lazy(() =>
  import("./pages/AttendanceScanPage").then((module) => ({
    default: module.AttendanceScanPage,
  })),
);

function App() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <Suspense
          fallback={
            <div className="page-shell" aria-live="polite">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="programs/:slug" element={<ProgramPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="students"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute
                      allowedRoles={["ADMIN", "TEACHER", "ACCOUNTANT"]}
                    >
                      <StudentsPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="teachers"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                      <TeachersPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="classes"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                      <ClassesPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="subjects"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                      <SubjectsPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="exams"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                      <ExamsPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="attendance"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                      <AttendancePage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="attendance/scan"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
                    <Suspense
                      fallback={
                        <div className="page-shell">Loading scanner...</div>
                      }
                    >
                      <AttendanceScanPage />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="fees"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "ACCOUNTANT"]}>
                      <FeesPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="notices"
                element={
                  <ProtectedRoute>
                    <NoticesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reports"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN", "ACCOUNTANT"]}>
                      <ReportsPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute>
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <UsersPage />
                    </ProtectedRoute>
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher"
                element={
                  <ProtectedRoute allowedRoles={["TEACHER"]}>
                    <TeacherDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="student"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT"]}>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="student/fees"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT"]}>
                    <StudentFeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="accounting"
                element={
                  <ProtectedRoute allowedRoles={["ACCOUNTANT"]}>
                    <AccountantDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </LocaleProvider>
    </AuthProvider>
  );
}

export default App;
