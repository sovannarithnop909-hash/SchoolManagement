import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  GraduationCap,
  Users,
  Wallet,
  TrendingUp,
  CalendarRange,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "../api/client";
import { useLocale } from "../context/LocaleContext";

const COLORS = ["#2f6fed", "#8ecae6"];

export function DashboardPage() {
  const { t } = useLocale();
  const [dashboardData, setDashboardData] = useState({
    studentCount: 0,
    teacherCount: 0,
    classCount: 0,
    collected: 0,
    enrollmentData: [],
    attendanceData: [],
    feeData: [],
  });
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/students"),
      api.get("/teachers"),
      api.get("/classes"),
      api.get("/attendance"),
      api.get("/fees"),
      api.get("/payments"),
    ])
      .then(
        ([
          studentResponse,
          teacherResponse,
          classResponse,
          attendanceResponse,
          feeResponse,
          paymentResponse,
        ]) => {
          const students = studentResponse.data;
          const attendance = attendanceResponse.data;
          const months = Array.from({ length: 6 }, (_, index) => {
            const month = new Date();
            month.setDate(1);
            month.setMonth(month.getMonth() - (5 - index));
            const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
            return {
              key,
              month: month.toLocaleDateString("en-US", { month: "short" }),
              students: 0,
              present: 0,
              totalAttendance: 0,
            };
          });
          const monthByKey = new Map(months.map((month) => [month.key, month]));

          students.forEach((student) => {
            const month = monthByKey.get(
              String(student.enrollmentDate).slice(0, 7),
            );
            if (month) month.students += 1;
          });
          attendance.forEach((record) => {
            const month = monthByKey.get(
              String(record.attendanceDate).slice(0, 7),
            );
            if (month) {
              month.totalAttendance += 1;
              if (record.status === "PRESENT") month.present += 1;
            }
          });

          if (active) {
            const fees = feeResponse.data;
            setDashboardData({
              studentCount: students.length,
              teacherCount: teacherResponse.data.length,
              classCount: classResponse.data.length,
              collected: paymentResponse.data
                .filter((payment) => payment.status === "SUCCESS")
                .reduce((total, payment) => total + Number(payment.amount), 0),
              enrollmentData: months.map(({ month, students: count }) => ({
                month,
                students: count,
              })),
              attendanceData: months.map(
                ({ month, present, totalAttendance }) => ({
                  month,
                  attendance: totalAttendance
                    ? Math.round((present / totalAttendance) * 100)
                    : 0,
                }),
              ),
              feeData: [
                {
                  name: "Paid",
                  value: fees.filter((fee) => fee.status === "PAID").length,
                },
                {
                  name: "Pending",
                  value: fees.filter((fee) => fee.status !== "PAID").length,
                },
              ],
            });
            setLoadError("");
          }
        },
      )
      .catch(() => {
        if (active) setLoadError("Unable to load dashboard data.");
      });
    return () => {
      active = false;
    };
  }, []);

  const summaryCards = [
    { label: "Total Students", value: dashboardData.studentCount, icon: Users },
    {
      label: "Total Teachers",
      value: dashboardData.teacherCount,
      icon: GraduationCap,
    },
    {
      label: "Total Classes",
      value: dashboardData.classCount,
      icon: BookOpenCheck,
    },
    {
      label: "Fees Collected",
      value: `$${dashboardData.collected.toLocaleString()}`,
      icon: Wallet,
    },
  ];
  const localizedEnrollmentData = dashboardData.enrollmentData.map((entry) => ({
    ...entry,
    month: t(entry.month),
  }));
  const localizedAttendanceData = dashboardData.attendanceData.map((entry) => ({
    ...entry,
    month: t(entry.month),
  }));
  const localizedFeeData = dashboardData.feeData.map((entry) => ({
    ...entry,
    name: t(entry.name),
  }));

  return (
    <div className="page-shell dashboard-page">
      <div className="section-header inline-header">
        <div>
          <span className="eyebrow">{t("Overview")}</span>
          <h2>{t("School Dashboard")}</h2>
        </div>
        <Link className="primary-btn small-btn" to="/reports">
          {t("Generate Report")}
        </Link>
      </div>
      {loadError && (
        <p className="form-error" role="alert">
          {t(loadError)}
        </p>
      )}

      <div className="stats-grid summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card dashboard-stat">
              <div className="stat-icon">
                <Icon size={18} />
              </div>
              <div>
                <strong>{card.value}</strong>
                <span>{t(card.label)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-grid">
        <div className="panel-box">
          <div className="panel-head">
            <h3>{t("Student Enrollment")}</h3>
            <TrendingUp size={18} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={localizedEnrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#2f6fed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel-box">
          <div className="panel-head">
            <h3>{t("Attendance Progress")}</h3>
            <CalendarRange size={18} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={localizedAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel-box">
          <div className="panel-head">
            <h3>{t("Fee Collection")}</h3>
            <Wallet size={18} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={localizedFeeData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {localizedFeeData.map((entry, index) => (
                  <Cell
                    key={dashboardData.feeData[index].name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
