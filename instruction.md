# 🏆 Mini Hackathon Team Evaluation System

A cloud-based web application used to manage teams, register students, evaluate projects, calculate scores automatically, and rank teams for the beginner C++ mini hackathon.

---

# 🎯 Main Goal

Build a simple but professional system that allows judges to:

* Register teams
* Add students inside each team
* Evaluate teams using detailed criteria
* Automatically calculate totals
* Rank teams automatically
* Store data permanently in the cloud
* Access the system from anywhere

The system evaluates teams, not individual students.

---

# 👥 User Roles

## 1. Admin / Judge

Can:

* Register teams
* Add/edit/delete teams
* Add members
* Enter scores
* View rankings
* Search teams
* Export results

---

# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

## Styling

* Bootstrap 5

## Backend / Database

* [Supabase](https://supabase.com?utm_source=chatgpt.com)

  * PostgreSQL database
  * REST API
  * Cloud persistence
  * Authentication (optional)

## Deployment

* [Netlify](https://www.netlify.com?utm_source=chatgpt.com) or [Vercel](https://vercel.com?utm_source=chatgpt.com)

---

# ✅ Why This Stack

| Requirement        | Solution          |
| ------------------ | ----------------- |
| Build in 1–2 hours | Simple frontend   |
| Persistent data    | Supabase cloud DB |
| Access anywhere    | Cloud-hosted      |
| Easy deployment    | Netlify/Vercel    |
| No backend coding  | Supabase APIs     |
| Easy UI            | Bootstrap         |
| Fast development   | Vanilla JS        |

---

# 📦 Core Features

# 1️⃣ Team Management

## Features

* Register new team
* Edit team
* Delete team
* Search team
* View all teams

## Team Information

| Field                        |
| ---------------------------- |
| Team Name                    |
| Team Code (optional)         |
| School/Department (optional) |
| Registration Date            |

---

# 2️⃣ Team Member Management

Each team can contain multiple students.

## Features

* Add members to team
* Remove member
* Edit member

## Member Information

| Field                 |
| --------------------- |
| Full Name             |
| Student ID (optional) |
| Phone (optional)      |

---

# 3️⃣ Evaluation System

Judges evaluate each team based on detailed criteria.

---

# 📘 Evaluation Categories

# A. Program Execution & Correctness — 40 Points

| Criteria               | Max Score |
| ---------------------- | --------- |
| Program runs correctly | 5         |
| Add Student Feature    | 5         |
| Display Students       | 5         |
| Search Student         | 5         |
| Update Student         | 5         |
| Class Average          | 5         |
| Top Student            | 5         |
| Pass/Fail Statistics   | 5         |

---

# B. Code Organization & Functions — 20 Points

| Criteria                 | Max |
| ------------------------ | --- |
| Proper function usage    | 5   |
| Clean code               | 5   |
| Indentation & formatting | 5   |
| Meaningful naming        | 5   |

---

# C. Logic & Problem Solving — 20 Points

| Criteria           | Max |
| ------------------ | --- |
| Proper loops       | 5   |
| Correct conditions | 5   |
| Array handling     | 5   |
| Edge case handling | 5   |

---

# D. User Experience & Interface — 10 Points

| Criteria               | Max |
| ---------------------- | --- |
| Clear menu design      | 3   |
| Output formatting      | 3   |
| Helpful messages       | 2   |
| Invalid input handling | 2   |

---

# E. Bonus Features — 10 Points

| Bonus Feature        | Max |
| -------------------- | --- |
| Delete Student       | 5   |
| Sorting Students     | 5   |
| Grade System         | 3   |
| Duplicate Validation | 3   |
| Partial Search       | 3   |

Bonus should cap at 10 total.

---

# 4️⃣ Automatic Score Calculation

The system should automatically:

* calculate section totals
* calculate final total
* prevent manual calculation errors

## Example

| Category     | Score |
| ------------ | ----- |
| Correctness  | 35    |
| Organization | 18    |
| Logic        | 17    |
| UI           | 8     |
| Bonus        | 6     |
| Final Total  | 84    |

---

# 5️⃣ Automatic Team Ranking

The system should:

* sort teams by total score
* assign rankings automatically

## Example

| Rank | Team         | Total |
| ---- | ------------ | ----- |
| 1    | Code Masters | 92    |
| 2    | ByteForce    | 88    |
| 3    | Dev Warriors | 80    |

---

# 6️⃣ Search & Filtering

## Features

* Search by team name
* Search by member name
* Filter by rank
* Filter by score

---

# 7️⃣ Judge Notes

Judges can add comments.

## Example

```text id="7v0yzw"
Good logic implementation but poor formatting.
```

---

# 8️⃣ Validation System

The system should:

* prevent score above maximum
* prevent empty team names
* prevent duplicate teams
* validate required fields

---

# 9️⃣ Dashboard

Main dashboard displays:

* Total Teams
* Highest Score
* Average Score
* Top Team
* Total Participants

---

# 🔟 Export Features

Allow exporting:

* PDF report
* CSV
* Excel

Useful for:

* certificates
* award ceremony
* announcements

---

# 🗂️ Database Structure

# Table: teams

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| name       | TEXT      |
| created_at | TIMESTAMP |

---

# Table: members

| Column    | Type |
| --------- | ---- |
| id        | UUID |
| team_id   | UUID |
| full_name | TEXT |

---

# Table: evaluations

| Column               | Type    |
| -------------------- | ------- |
| id                   | UUID    |
| team_id              | UUID    |
| program_runs         | INTEGER |
| add_student          | INTEGER |
| display_students     | INTEGER |
| search_student       | INTEGER |
| update_student       | INTEGER |
| class_average        | INTEGER |
| top_student          | INTEGER |
| pass_fail            | INTEGER |
| functions            | INTEGER |
| clean_code           | INTEGER |
| formatting           | INTEGER |
| naming               | INTEGER |
| loops                | INTEGER |
| conditions           | INTEGER |
| arrays               | INTEGER |
| edge_cases           | INTEGER |
| menu_design          | INTEGER |
| output_format        | INTEGER |
| helpful_messages     | INTEGER |
| invalid_input        | INTEGER |
| delete_feature       | INTEGER |
| sorting              | INTEGER |
| grade_system         | INTEGER |
| duplicate_validation | INTEGER |
| partial_search       | INTEGER |
| total_score          | INTEGER |
| judge_note           | TEXT    |

---

# 📄 Suggested Pages

| Page         | Purpose             |
| ------------ | ------------------- |
| Dashboard    | Statistics overview |
| Teams        | Team management     |
| Team Details | Members             |
| Evaluation   | Judge scoring form  |
| Rankings     | Leaderboard         |
| Reports      | Export results      |

---

# 🎨 UI Requirements

## Style

* Clean
* Modern
* Minimal
* Responsive

## Colors

* Blue primary theme
* White cards
* Soft shadows

## Components

* Navbar
* Cards
* Tables
* Modal forms
* Ranking badges

---

# ⚡ Important Functional Requirements

## Must Support

✅ Persistent cloud database
✅ Multi-device access
✅ Mobile responsive
✅ Real-time updates (optional)
✅ Automatic calculations
✅ Automatic rankings
✅ Fast loading

---

# 🚀 Deployment Requirements

Deploy frontend using:

* [Netlify](https://www.netlify.com?utm_source=chatgpt.com)
  or
* [Vercel](https://vercel.com?utm_source=chatgpt.com)

Database hosted on:

* [Supabase](https://supabase.com?utm_source=chatgpt.com)

---

# 🧠 Instructions for Antigravity Agentic AI

## Development Goals

* Build quickly
* Prioritize functionality first
* Use modular JavaScript
* Use Supabase SDK directly
* Avoid unnecessary complexity
* Keep code beginner-friendly and maintainable

---

# ✅ Final Expected Result

A professional cloud-based mini hackathon evaluation platform that:

* manages teams
* stores members
* evaluates projects
* calculates totals
* ranks teams automatically
* persists data permanently
* can be accessed from anywhere.
