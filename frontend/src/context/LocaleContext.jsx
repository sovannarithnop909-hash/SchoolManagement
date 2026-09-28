import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  "School Management": "ការគ្រប់គ្រងសាលារៀន",
  Home: "ទំព័រដើម",
  Dashboard: "ផ្ទាំងគ្រប់គ្រង",
  Logout: "ចាកចេញ",
  Login: "ចូលគណនី",
  Students: "សិស្ស",
  Teachers: "គ្រូបង្រៀន",
  Classes: "ថ្នាក់រៀន",
  Subjects: "មុខវិជ្ជា",
  "Exams & Grades": "ការប្រឡង និងពិន្ទុ",
  Attendance: "វត្តមាន",
  Fees: "ថ្លៃសិក្សា",
  Notices: "សេចក្តីជូនដំណឹង",
  Reports: "របាយការណ៍",
  Users: "អ្នកប្រើប្រាស់",
  "Admin Portal": "ប្រព័ន្ធអ្នកគ្រប់គ្រង",
  Admin: "អ្នកគ្រប់គ្រង",
  Language: "ភាសា",
  Overview: "ទិដ្ឋភាពទូទៅ",
  "Generate Report": "បង្កើតរបាយការណ៍",
  "Total Students": "ចំនួនសិស្សសរុប",
  "Total Teachers": "ចំនួនគ្រូសរុប",
  "Total Classes": "ចំនួនថ្នាក់សរុប",
  "Fees Collected": "ថ្លៃសិក្សាដែលបានប្រមូល",
  "Student Enrollment": "ការចុះឈ្មោះសិស្ស",
  "School Dashboard": "ផ្ទាំងគ្រប់គ្រងសាលា",
  Student: "សិស្ស",
  students: "សិស្ស",
  attendance: "វត្តមាន",
  "Attendance Progress": "វឌ្ឍនភាពវត្តមាន",
  "Fee Collection": "ការប្រមូលថ្លៃសិក្សា",
  Paid: "បានបង់",
  Pending: "កំពុងរង់ចាំ",
  Jan: "មករា",
  Feb: "កុម្ភៈ",
  Mar: "មីនា",
  Apr: "មេសា",
  May: "ឧសភា",
  Jun: "មិថុនា",
  "Empowering Excellence": "ជំរុញភាពឆ្នើម",
  "Where knowledge grows and dreams become reality.":
    "កន្លែងដែលចំណេះដឹងរីកចម្រើន និងក្តីសុបិនក្លាយជាការពិត។",
  "Northfield Academy creates a future-ready learning environment through innovation, academic excellence, and student-centered support.":
    "សាលា Northfield បង្កើតបរិយាកាសសិក្សាត្រៀមខ្លួនសម្រាប់អនាគត តាមរយៈនវានុវត្តន៍ ឧត្តមភាពសិក្សា និងការគាំទ្រដែលផ្តោតលើសិស្ស។",
  "Explore Programs": "ស្វែងយល់ពីកម្មវិធីសិក្សា",
  "Admissions Open": "កំពុងទទួលពាក្យចូលរៀន",
  "2025 Academic Year": "ឆ្នាំសិក្សា ២០២៥",
  "2,500+ Students": "សិស្សជាង ២,៥០០ នាក់",
  "30+ Modern Labs": "មន្ទីរពិសោធន៍ទំនើបជាង ៣០",
  Programs: "កម្មវិធីសិក្សា",
  "Success Rate": "អត្រាជោគជ័យ",
  "Learning pathways for every ambition": "ផ្លូវសិក្សាសម្រាប់គ្រប់គោលបំណង",
  "Explore program": "ស្វែងយល់ពីកម្មវិធី",
  "Back to programs": "ត្រឡប់ទៅកម្មវិធីសិក្សា",
  "Areas of study": "មុខវិជ្ជាសិក្សា",
  "Learning experience": "បទពិសោធន៍សិក្សា",
  "Program outcomes": "លទ្ធផលកម្មវិធីសិក្សា",
  "Students working in a modern science laboratory":
    "សិស្សកំពុងធ្វើការនៅក្នុងមន្ទីរពិសោធន៍វិទ្យាសាស្ត្រទំនើប",
  "Artist painting in a bright art studio":
    "វិចិត្រករកំពុងគូរគំនូរនៅក្នុងស្ទូឌីយោសិល្បៈភ្លឺស្វាង",
  "Business analytics displayed on a laptop":
    "ទិន្នន័យវិភាគធុរកិច្ចបង្ហាញនៅលើកុំព្យូទ័រយួរដៃ",
  "Explore science, technology, engineering, and mathematics through hands-on projects that connect classroom theory with practical problem-solving.":
    "ស្វែងយល់ពីវិទ្យាសាស្ត្រ បច្ចេកវិទ្យា វិស្វកម្ម និងគណិតវិទ្យា តាមរយៈគម្រោងអនុវត្តដែលភ្ជាប់ទ្រឹស្តីក្នុងថ្នាក់ទៅនឹងការដោះស្រាយបញ្ហាជាក់ស្តែង។",
  "Life sciences, chemistry, and laboratory research":
    "វិទ្យាសាស្ត្រជីវិត គីមីវិទ្យា និងការស្រាវជ្រាវក្នុងមន្ទីរពិសោធន៍",
  "Mathematics, statistics, and applied problem-solving":
    "គណិតវិទ្យា ស្ថិតិ និងការដោះស្រាយបញ្ហាអនុវត្ត",
  "Technology, coding, and engineering design":
    "បច្ចេកវិទ្យា ការសរសេរកូដ និងការរចនាវិស្វកម្ម",
  "Carry out guided investigations and explain your findings":
    "អនុវត្តការស្រាវជ្រាវដោយមានការណែនាំ និងពន្យល់ពីលទ្ធផល",
  "Build prototypes and test ideas in collaborative teams":
    "បង្កើតគំរូសាកល្បង និងសាកល្បងគំនិតជាមួយក្រុម",
  "Present solutions to practical challenges":
    "បង្ហាញដំណោះស្រាយចំពោះបញ្ហាជាក់ស្តែង",
  "Reason confidently with evidence and data":
    "ប្រើភស្តុតាង និងទិន្នន័យដើម្បីវិភាគដោយមានទំនុកចិត្ត",
  "Apply safe and repeatable laboratory practices":
    "អនុវត្តវិធីសាស្ត្រមន្ទីរពិសោធន៍ដែលមានសុវត្ថិភាព និងអាចធ្វើឡើងវិញបាន",
  "Prepare for further study in science and engineering":
    "ត្រៀមខ្លួនសម្រាប់ការសិក្សាបន្តផ្នែកវិទ្យាសាស្ត្រ និងវិស្វកម្ម",
  "Study literature, history, visual arts, and culture while developing a clear personal voice and a thoughtful understanding of society.":
    "សិក្សាអក្សរសាស្ត្រ ប្រវត្តិសាស្ត្រ សិល្បៈទស្សនីយភាព និងវប្បធម៌ ព្រមទាំងអភិវឌ្ឍសំឡេងផ្ទាល់ខ្លួន និងការយល់ដឹងស៊ីជម្រៅអំពីសង្គម។",
  "Literature, storytelling, and language": "អក្សរសាស្ត្រ ការនិទានរឿង និងភាសា",
  "History, culture, and social inquiry":
    "ប្រវត្តិសាស្ត្រ វប្បធម៌ និងការសិក្សាសង្គម",
  "Visual and performing arts": "សិល្បៈទស្សនីយភាព និងសិល្បៈសម្ដែង",
  "Create original work in writing and visual media":
    "បង្កើតស្នាដៃដើមតាមរយៈការសរសេរ និងប្រព័ន្ធផ្សព្វផ្សាយទស្សនីយភាព",
  "Interpret primary sources and artistic works":
    "បកស្រាយប្រភពដើម និងស្នាដៃសិល្បៈ",
  "Share ideas through presentations and exhibitions":
    "ចែករំលែកគំនិតតាមរយៈបទបង្ហាញ និងការតាំងពិព័រណ៍",
  "Strengthen communication and interpretation":
    "ពង្រឹងជំនាញទំនាក់ទំនង និងការបកស្រាយ",
  "Practice creative thinking and ethical inquiry":
    "អនុវត្តការគិតច្នៃប្រឌិត និងការសិក្សាស្រាវជ្រាវប្រកបដោយសីលធម៌",
  "Prepare for further study in arts and humanities":
    "ត្រៀមខ្លួនសម្រាប់ការសិក្សាបន្តផ្នែកសិល្បៈ និងមនុស្សសាស្ត្រ",
  "Explore how organizations create value through finance, economics, entrepreneurship, and strategic decision-making.":
    "ស្វែងយល់ពីរបៀបដែលស្ថាប័នបង្កើតតម្លៃតាមរយៈហិរញ្ញវត្ថុ សេដ្ឋកិច្ច សហគ្រិនភាព និងការសម្រេចចិត្តជាយុទ្ធសាស្ត្រ។",
  "Accounting, finance, and economics": "គណនេយ្យ ហិរញ្ញវត្ថុ និងសេដ្ឋកិច្ច",
  "Entrepreneurship and business planning":
    "សហគ្រិនភាព និងការរៀបចំផែនការធុរកិច្ច",
  "Marketing, management, and strategy": "ទីផ្សារ ការគ្រប់គ្រង និងយុទ្ធសាស្ត្រ",
  "Build and present a practical business plan":
    "រៀបចំ និងបង្ហាញផែនការធុរកិច្ចជាក់ស្តែង",
  "Analyze budgets, markets, and case studies":
    "វិភាគថវិកា ទីផ្សារ និងករណីសិក្សា",
  "Collaborate on product and marketing projects":
    "សហការលើគម្រោងផលិតផល និងទីផ្សារ",
  "Develop financial and data literacy":
    "អភិវឌ្ឍចំណេះដឹងផ្នែកហិរញ្ញវត្ថុ និងទិន្នន័យ",
  "Communicate ideas and lead collaborative work":
    "ប្រាស្រ័យទាក់ទងគំនិត និងដឹកនាំការងារជាក្រុម",
  "Prepare for study in business, economics, or management":
    "ត្រៀមខ្លួនសម្រាប់ការសិក្សាផ្នែកធុរកិច្ច សេដ្ឋកិច្ច ឬការគ្រប់គ្រង",
  "STEM Program": "កម្មវិធី STEM",
  "Focus on science, mathematics, and innovation.":
    "ផ្តោតលើវិទ្យាសាស្ត្រ គណិតវិទ្យា និងនវានុវត្តន៍។",
  "Arts & Humanities": "សិល្បៈ និងមនុស្សសាស្ត្រ",
  "Creative thinking and expressive communication.":
    "ការគិតច្នៃប្រឌិត និងការប្រាស្រ័យទាក់ទងប្រកបដោយការបង្ហាញ។",
  "Business Studies": "ការសិក្សាធុរកិច្ច",
  "Leadership, entrepreneurship, and strategy.":
    "ភាពជាអ្នកដឹកនាំ សហគ្រិនភាព និងយុទ្ធសាស្ត្រ។",
  "Our Faculty": "បុគ្គលិកបង្រៀនរបស់យើង",
  "Experienced teachers who inspire growth":
    "គ្រូដែលមានបទពិសោធន៍ និងជំរុញការរីកចម្រើន",
  "Senior Faculty": "បុគ្គលិកបង្រៀនជាន់ខ្ពស់",
  "News & Events": "ព័ត៌មាន និងព្រឹត្តិការណ៍",
  "Latest community updates": "ព័ត៌មានថ្មីៗរបស់សហគមន៍",
  "Science Fair": "ពិព័រណ៍វិទ្យាសាស្ត្រ",
  "Parents Seminar": "សិក្ខាសាលាមាតាបិតា",
  "Annual Sports Day": "ទិវាកីឡាប្រចាំឆ្នាំ",
  "Stay informed with our upcoming school events and achievements.":
    "សូមតាមដានព្រឹត្តិការណ៍ និងសមិទ្ធផលថ្មីៗរបស់សាលា។",
  Contact: "ទំនាក់ទំនង",
  "Let’s build brighter futures together.": "រួមគ្នាកសាងអនាគតដ៏ភ្លឺស្វាង។",
  "Student Directory": "បញ្ជីសិស្ស",
  "Add Student": "បន្ថែមសិស្ស",
  "Student ID": "លេខសម្គាល់សិស្ស",
  Name: "ឈ្មោះ",
  Gender: "ភេទ",
  Email: "អ៊ីមែល",
  Class: "ថ្នាក់",
  Status: "ស្ថានភាព",
  Female: "ស្រី",
  Male: "ប្រុស",
  Active: "សកម្ម",
  "Faculty Management": "ការគ្រប់គ្រងគ្រូបង្រៀន",
  "Add Teacher": "បន្ថែមគ្រូបង្រៀន",
  "Teacher ID": "លេខសម្គាល់គ្រូ",
  Subject: "មុខវិជ្ជា",
  Phone: "ទូរស័ព្ទ",
  "Class Overview": "ទិដ្ឋភាពទូទៅនៃថ្នាក់",
  "Add Class": "បន្ថែមថ្នាក់",
  "Class ID": "លេខសម្គាល់ថ្នាក់",
  Grade: "កម្រិតថ្នាក់",
  Room: "បន្ទប់",
  Teacher: "គ្រូបង្រៀន",
  "Subject Catalog": "បញ្ជីមុខវិជ្ជា",
  "Add Subject": "បន្ថែមមុខវិជ្ជា",
  "Subject ID": "លេខសម្គាល់មុខវិជ្ជា",
  Code: "កូដ",
  "Assessment Center": "មជ្ឈមណ្ឌលវាយតម្លៃ",
  "Add Exam": "បន្ថែមការប្រឡង",
  "Exam ID": "លេខសម្គាល់ការប្រឡង",
  Type: "ប្រភេទ",
  Midterm: "ប្រឡងពាក់កណ្តាលឆមាស",
  Final: "ប្រឡងបញ្ចប់ឆមាស",
  Open: "បើក",
  Draft: "សេចក្តីព្រាង",
  "Student Attendance": "វត្តមានសិស្ស",
  "Mark Attendance": "កត់ត្រាវត្តមាន",
  Date: "កាលបរិច្ឆេទ",
  Remark: "កំណត់សម្គាល់",
  Present: "មានវត្តមាន",
  Absent: "អវត្តមាន",
  "On time": "ទាន់ពេល",
  "Medical leave": "ច្បាប់ឈប់សម្រាកព្យាបាល",
  "Fee Management": "ការគ្រប់គ្រងថ្លៃសិក្សា",
  "Record Payment": "កត់ត្រាការទូទាត់",
  "Fee ID": "លេខសម្គាល់ថ្លៃសិក្សា",
  Amount: "ចំនួនទឹកប្រាក់",
  Tuition: "ថ្លៃសិក្សា",
  Library: "បណ្ណាល័យ",
  "School Announcements": "សេចក្តីប្រកាសរបស់សាលា",
  "New Notice": "សេចក្តីជូនដំណឹងថ្មី",
  Title: "ចំណងជើង",
  Author: "អ្នកនិពន្ធ",
  Audience: "អ្នកទទួល",
  "Publish Date": "កាលបរិច្ឆេទផ្សព្វផ្សាយ",
  Everyone: "អ្នកទាំងអស់គ្នា",
  Parents: "មាតាបិតា",
  Published: "បានផ្សព្វផ្សាយ",
  "Welcome Back": "សូមស្វាគមន៍ការត្រឡប់មកវិញ",
  "Parent Orientation": "ជំនួបណែនាំមាតាបិតា",
  "Performance & Analytics": "លទ្ធផល និងការវិភាគ",
  "Export PDF": "នាំចេញជា PDF",
  "Student Reports": "របាយការណ៍សិស្ស",
  "Enrollment and performance summaries.":
    "សេចក្តីសង្ខេបការចុះឈ្មោះ និងលទ្ធផលសិក្សា។",
  "Attendance Reports": "របាយការណ៍វត្តមាន",
  "Daily, weekly, and monthly analytics.":
    "ការវិភាគប្រចាំថ្ងៃ ប្រចាំសប្តាហ៍ និងប្រចាំខែ។",
  "Financial Reports": "របាយការណ៍ហិរញ្ញវត្ថុ",
  "Fees collected and monthly revenue totals.":
    "ថ្លៃសិក្សាដែលបានប្រមូល និងប្រាក់ចំណូលសរុបប្រចាំខែ។",
  "User Administration": "ការគ្រប់គ្រងអ្នកប្រើប្រាស់",
  "My Profile": "ប្រវត្តិរូបរបស់ខ្ញុំ",
  Employee: "បុគ្គលិក",
  "Review your account and personal information.":
    "ពិនិត្យព័ត៌មានគណនី និងព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក។",
  "Profile information": "ព័ត៌មានប្រវត្តិរូប",
  "Loading profile...": "កំពុងផ្ទុកប្រវត្តិរូប...",
  "Could not load profile information.": "មិនអាចផ្ទុកព័ត៌មានប្រវត្តិរូបបានទេ។",
  "Profile photo": "រូបថតប្រវត្តិរូប",
  "Change photo": "ប្តូររូបថត",
  "Remove photo": "លុបរូបថត",
  "Uploading photo...": "កំពុងបញ្ចូលរូបថត...",
  "Choose an image file.": "សូមជ្រើសរើសឯកសាររូបភាព។",
  "Choose an image smaller than 10 MB.":
    "សូមជ្រើសរើសរូបភាពដែលមានទំហំតូចជាង ១០ MB។",
  "Could not update profile photo.": "មិនអាចប្តូររូបថតប្រវត្តិរូបបានទេ។",
  "Member since": "ជាសមាជិកចាប់ពី",
  Address: "អាសយដ្ឋាន",
  "Assigned classes": "ថ្នាក់ដែលបានចាត់តាំង",
  "Create User": "បង្កើតអ្នកប្រើប្រាស់",
  Role: "តួនាទី",
  "System Admin": "អ្នកគ្រប់គ្រងប្រព័ន្ធ",
  "Welcome back": "សូមស្វាគមន៍ការត្រឡប់មកវិញ",
  "Sign in to your school portal": "ចូលទៅកាន់ប្រព័ន្ធសាលារបស់អ្នក",
  Password: "ពាក្យសម្ងាត់",
  "Remember me": "ចងចាំខ្ញុំ",
  "Forgot password?": "ភ្លេចពាក្យសម្ងាត់មែនទេ?",
  "Signing in...": "កំពុងចូល...",
  "Login failed": "ការចូលគណនីបរាជ័យ",
  "The page you are looking for does not exist.":
    "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ។",
  "Back Home": "ត្រឡប់ទៅទំព័រដើម",
  ADMIN: "អ្នកគ្រប់គ្រង",
  TEACHER: "គ្រូបង្រៀន",
  STUDENT: "សិស្ស",
  ACCOUNTANT: "គណនេយ្យករ",
  "Teacher workspace": "កន្លែងធ្វើការរបស់គ្រូ",
  "Student portal": "ប្រព័ន្ធសិស្ស",
  "Finance office": "ការិយាល័យហិរញ្ញវត្ថុ",
  Welcome: "សូមស្វាគមន៍",
  "My classes": "ថ្នាក់របស់ខ្ញុំ",
  "Teacher check-ins": "វត្តមានចូលរបស់គ្រូ",
  "My check-in history": "ប្រវត្តិវត្តមានចូលរបស់ខ្ញុំ",
  "No teacher check-ins recorded yet.":
    "មិនទាន់មានកំណត់ត្រាវត្តមានចូលរបស់គ្រូទេ។",
  "My class": "ថ្នាក់របស់ខ្ញុំ",
  "Students in my classes": "សិស្សក្នុងថ្នាក់របស់ខ្ញុំ",
  "Scan QR": "ស្កេន QR",
  Assessments: "ការវាយតម្លៃ",
  "Record student or teacher check-in": "កត់ត្រាវត្តមានសិស្ស ឬគ្រូ",
  "Create and review exams": "បង្កើត និងពិនិត្យការប្រឡង",
  "Manage your classes, assessments, and daily attendance.":
    "គ្រប់គ្រងថ្នាក់ ការវាយតម្លៃ និងវត្តមានប្រចាំថ្ងៃ។",
  "Your assigned classes will appear here.":
    "ថ្នាក់ដែលបានចាត់តាំងនឹងបង្ហាញនៅទីនេះ។",
  "Take attendance": "កត់ត្រាវត្តមាន",
  "Student roster": "បញ្ជីសិស្ស",
  "Class schedule": "កាលវិភាគថ្នាក់",
  "Days present": "ចំនួនថ្ងៃមានវត្តមាន",
  "My fee records": "កំណត់ត្រាថ្លៃសិក្សារបស់ខ្ញុំ",
  "Your learning, attendance, and fee information in one place.":
    "ព័ត៌មានសិក្សា វត្តមាន និងថ្លៃសិក្សារបស់អ្នកនៅកន្លែងតែមួយ។",
  "Recent attendance": "វត្តមានថ្មីៗ",
  "No attendance has been recorded yet.": "មិនទាន់មានកំណត់ត្រាវត្តមានទេ។",
  "Recent grades": "ពិន្ទុថ្មីៗ",
  "Your grades will appear here after your teachers enter them.":
    "ពិន្ទុរបស់អ្នកនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីគ្រូបញ្ចូល។",
  "Fee and payment management": "ការគ្រប់គ្រងថ្លៃសិក្សា និងការទូទាត់",
  "Track enrollment charges, payments, and outstanding balances.":
    "តាមដានថ្លៃចុះឈ្មោះ ការទូទាត់ និងសមតុល្យនៅសល់។",
  "Collected payments": "ប្រាក់ដែលបានប្រមូល",
  "Outstanding fees": "ថ្លៃសិក្សានៅសល់",
  "Fee records": "កំណត់ត្រាថ្លៃសិក្សា",
  "Payment transactions": "ប្រតិបត្តិការទូទាត់",
  "Manage tuition and fees": "គ្រប់គ្រងថ្លៃសិក្សា និងកម្រៃផ្សេងៗ",
  "Financial reports": "របាយការណ៍ហិរញ្ញវត្ថុ",
  "Enrollment roster": "បញ្ជីចុះឈ្មោះ",
  "Recent payments": "ការទូទាត់ថ្មីៗ",
  "No payments have been recorded yet.": "មិនទាន់មានកំណត់ត្រាការទូទាត់ទេ។",
  "My attendance QR": "QR វត្តមានរបស់ខ្ញុំ",
  "Show this code to an authorized staff member to check in.":
    "បង្ហាញកូដនេះដល់បុគ្គលិកដែលមានសិទ្ធិ ដើម្បីកត់ត្រាវត្តមាន។",
  "Unable to load attendance QR code.": "មិនអាចផ្ទុក QR វត្តមានបានទេ។",
  "Loading QR code": "កំពុងផ្ទុក QR Code",
  "Scan attendance QR": "ស្កេន QR វត្តមាន",
  "Scan a student's or teacher's current QR code to record today's check-in.":
    "ស្កេន QR បច្ចុប្បន្នរបស់សិស្ស ឬគ្រូ ដើម្បីកត់ត្រាវត្តមានថ្ងៃនេះ។",
  "Restart scanner": "ចាប់ផ្តើមម៉ាស៊ីនស្កេនឡើងវិញ",
  "Check-in recorded": "បានកត់ត្រាវត្តមានហើយ",
  "Ready to scan": "រួចរាល់សម្រាប់ស្កេន",
  "The camera will record attendance after a valid QR code is scanned.":
    "កាមេរ៉ានឹងកត់ត្រាវត្តមាន បន្ទាប់ពីស្កេន QR ត្រឹមត្រូវ។",
  "Could not record this QR check-in.": "មិនអាចកត់ត្រាវត្តមានតាម QR នេះបានទេ។",
  "View attendance log": "មើលកំណត់ត្រាវត្តមាន",
  "Save attendance": "រក្សាទុកវត្តមាន",
  "Select a student": "ជ្រើសរើសសិស្ស",
  "Select a class": "ជ្រើសរើសថ្នាក់",
  "No attendance records found.": "រកមិនឃើញកំណត់ត្រាវត្តមានទេ។",
  "No students found.": "រកមិនឃើញសិស្សទេ។",
  "No teachers found.": "រកមិនឃើញគ្រូទេ។",
  "No classes found.": "រកមិនឃើញថ្នាក់ទេ។",
  "No exams found.": "រកមិនឃើញការប្រឡងទេ។",
  "Register student": "ចុះឈ្មោះសិស្ស",
  "Create student account": "បង្កើតគណនីសិស្ស",
  "Register teacher": "ចុះឈ្មោះគ្រូ",
  "Create teacher account": "បង្កើតគណនីគ្រូ",
  "Initial password": "ពាក្យសម្ងាត់ដំបូង",
  "First name": "នាមខ្លួន",
  "Last name": "នាមត្រកូល",
  "Date of birth": "ថ្ងៃខែឆ្នាំកំណើត",
  "Enrollment date": "ថ្ងៃចុះឈ្មោះ",
  "Hire date": "ថ្ងៃចូលបម្រើការងារ",
  "Parent name": "ឈ្មោះមាតាបិតា",
  "Parent phone": "លេខទូរស័ព្ទមាតាបិតា",
  "Initial tuition fee": "ថ្លៃសិក្សាដំបូង",
  "Fee due date": "ថ្ងៃផុតកំណត់បង់ថ្លៃ",
  Unassigned: "មិនទាន់ចាត់តាំង",
  "Create class": "បង្កើតថ្នាក់",
  "Save class": "រក្សាទុកថ្នាក់",
  "Create exam": "បង្កើតការប្រឡង",
  "Save exam": "រក្សាទុកការប្រឡង",
  "Start date": "ថ្ងៃចាប់ផ្តើម",
  "End date": "ថ្ងៃបញ្ចប់",
  Monthly: "ប្រចាំខែ",
  Quiz: "តេស្តខ្លី",
  Late: "យឺត",
  Excused: "មានការអនុញ្ញាត",
  PRESENT: "មានវត្តមាន",
  ABSENT: "អវត្តមាន",
  LATE: "យឺត",
  EXCUSED: "មានការអនុញ្ញាត",
  PARTIAL: "បង់មួយផ្នែក",
  OVERDUE: "ហួសកំណត់",
  "Create fee": "បង្កើតថ្លៃសិក្សា",
  "Save fee": "រក្សាទុកថ្លៃសិក្សា",
  "Save payment": "រក្សាទុកការទូទាត់",
  "Fee type": "ប្រភេទថ្លៃសិក្សា",
  "Payment date": "ថ្ងៃទូទាត់",
  "Payment method": "វិធីទូទាត់",
  "Reference number": "លេខយោង",
  "Fee record": "កំណត់ត្រាថ្លៃសិក្សា",
  "Select a fee": "ជ្រើសរើសថ្លៃសិក្សា",
  Registration: "ថ្លៃចុះឈ្មោះ",
  Transportation: "ថ្លៃដឹកជញ្ជូន",
  Uniform: "ឯកសណ្ឋាន",
  Other: "ផ្សេងៗ",
  Cash: "សាច់ប្រាក់",
  "Bank transfer": "ផ្ទេរប្រាក់តាមធនាគារ",
  Card: "កាត",
  "Online payment": "ទូទាត់តាមអនឡាញ",
  "Due date": "ថ្ងៃផុតកំណត់",
  "Outstanding balance": "សមតុល្យនៅសល់",
  "My fees and payments": "ថ្លៃសិក្សា និងការទូទាត់របស់ខ្ញុំ",
  "Review your tuition charges and payment history.":
    "ពិនិត្យថ្លៃសិក្សា និងប្រវត្តិការទូទាត់របស់អ្នក។",
  "Tuition and fees": "ថ្លៃសិក្សា និងកម្រៃផ្សេងៗ",
  "Payment history": "ប្រវត្តិការទូទាត់",
  "No fee records found.": "រកមិនឃើញកំណត់ត្រាថ្លៃសិក្សាទេ។",
  "Attendance Rate": "អត្រាវត្តមាន",
  "Export CSV": "នាំចេញជា CSV",
  "Fee report": "របាយការណ៍ថ្លៃសិក្សា",
  "Attendance summary": "សេចក្តីសង្ខេបវត្តមាន",
  "Enrollment summary": "សេចក្តីសង្ខេបការចុះឈ្មោះ",
  "attendance records": "កំណត់ត្រាវត្តមាន",
  "registered students": "សិស្សដែលបានចុះឈ្មោះ",
  "Unable to load report data.": "មិនអាចផ្ទុកទិន្នន័យរបាយការណ៍បានទេ។",
  "Unable to load finance records.": "មិនអាចផ្ទុកកំណត់ត្រាហិរញ្ញវត្ថុបានទេ។",
  "Unable to load students.": "មិនអាចផ្ទុកទិន្នន័យសិស្សបានទេ។",
  "Unable to load teachers.": "មិនអាចផ្ទុកទិន្នន័យគ្រូបានទេ។",
  "Unable to load classes.": "មិនអាចផ្ទុកទិន្នន័យថ្នាក់បានទេ។",
  "Unable to load exams.": "មិនអាចផ្ទុកទិន្នន័យការប្រឡងបានទេ។",
  "Unable to load attendance records.": "មិនអាចផ្ទុកកំណត់ត្រាវត្តមានបានទេ។",
  "Unable to load your teacher profile.":
    "មិនអាចផ្ទុកប្រវត្តិរូបគ្រូរបស់អ្នកបានទេ។",
  "Unable to load your student profile.":
    "មិនអាចផ្ទុកប្រវត្តិរូបសិស្សរបស់អ្នកបានទេ។",
  "Unable to load your fee records.":
    "មិនអាចផ្ទុកកំណត់ត្រាថ្លៃសិក្សារបស់អ្នកបានទេ។",
  "Saving...": "កំពុងរក្សាទុក...",
  Cancel: "បោះបង់",
  Close: "បិទ",
  ACTIVE: "សកម្ម",
  INACTIVE: "អសកម្ម",
  PAID: "បានបង់",
  PENDING: "កំពុងរង់ចាំ",
  SUCCESS: "ជោគជ័យ",
  FEMALE: "ស្រី",
  MALE: "ប្រុស",
  OTHER: "ផ្សេងៗ",
  MIDTERM: "ប្រឡងពាក់កណ្តាលឆមាស",
  FINAL: "ប្រឡងបញ្ចប់ឆមាស",
  MONTHLY: "ប្រចាំខែ",
  QUIZ: "តេស្តខ្លី",
  TUITION: "ថ្លៃសិក្សា",
  REGISTRATION: "ថ្លៃចុះឈ្មោះ",
  LIBRARY: "បណ្ណាល័យ",
  TRANSPORTATION: "ថ្លៃដឹកជញ្ជូន",
  UNIFORM: "ឯកសណ្ឋាន",
  CASH: "សាច់ប្រាក់",
  BANK_TRANSFER: "ផ្ទេរប្រាក់តាមធនាគារ",
  CARD: "កាត",
  ONLINE_PAYMENT: "ទូទាត់តាមអនឡាញ",
};

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("school-language") || "en",
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem("school-theme") || "light",
  );

  useEffect(() => {
    document.documentElement.lang = language === "km" ? "km" : "en";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("school-language", language);
    localStorage.setItem("school-theme", theme);
  }, [language, theme]);

  const t = (text) => (language === "km" ? translations[text] || text : text);

  return (
    <LocaleContext.Provider
      value={{ language, setLanguage, theme, setTheme, t }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
