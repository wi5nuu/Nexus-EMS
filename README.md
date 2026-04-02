# 🛡️ VANGUARD — Strategic Execution Hub

> **Unified Strategy, Absolute Velocity, Enterprise Intelligence.**
> Vanguard adalah platform manajemen strategis all-in-one untuk perusahaan yang ingin menyatukan eksekusi teknis dengan visi organisasi dalam satu pusat komando.

[![Version](https://img.shields.io/badge/Version-v0.0.1--Build--2026.4-blue?style=for-the-badge)](https://github.com/wi5nuu/Nexus-EMS)
[![Frontend: Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Backend: Fastify](https://img.shields.io/badge/Backend-Fastify-white?style=for-the-badge&logo=fastify)](https://fastify.io/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Infrastructure: Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Status: Production](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)](https://nexus-ems-flame.vercel.app/)

> [!CAUTION]
> **PROPRIETARY SOFTWARE NOTICE**  
> Proyek ini dilisensikan di bawah **Proprietary License**. Penggunaan komersial, redistribusi, atau modifikasi tanpa izin tertulis dari author (**Wisnu Alfian Nur Ashar**) dilarang keras. Dokumen ini dibuat untuk keperluan showcase arsitektur dan transparansi operasional.

**Production Instance**: [https://nexus-ems-flame.vercel.app/](https://nexus-ems-flame.vercel.app/)

---

## 📋 Daftar Isi

1. [Latar Belakang & Masalah](#-latar-belakang--masalah-problem-statement)
2. [Solusi (Solution Overview)](#-solusi-solution-overview)
3. [Tujuan Pembuatan (Goals & Objectives)](#-tujuan-pembuatan-goals--objectives)
4. [Manfaat (Benefits)](#-manfaat-benefits)
5. [Use Case Diagram](#-use-case-diagram)
6. [Sequence Diagram](#-sequence-diagram)
7. [Activity / Workflow Diagram](#-activity--workflow-diagram)
8. [Entity Relationship Diagram (ERD)](#-entity-relationship-diagram-erd)
9. [Arsitektur Sistem](#-arsitektur-sistem)
10. [Fitur Lengkap (Feature List)](#-fitur-lengkap-feature-list)
11. [Quick Start & Demo](#-quick-start--demo)
12. [Environment Variables](#-environment-variables)
13. [Role & Permission Matrix](#-role--permission-matrix)
14. [SLA & Incident Severity Matrix](#-sla--incident-severity-matrix)
15. [Dampak & Nilai Bisnis](#-dampak--nilai-bisnis-business-impact)
16. [Roadmap](#-roadmap)
17. [Contributing Guide](#-contributing-guide)
18. [Legal & Lisensi](#-legal--lisensi)
19. [FAQ](#-faq)
20. [Acknowledgements & Credits](#-acknowledgements--credits)

---

## 🧠 Latar Belakang & Masalah (Problem Statement)

### 2.1 Konteks Masalah

Dalam ekosistem perusahaan menengah hingga besar (Enterprise), tim engineering, HR, dan manajemen seringkali terjebak dalam "Silo Informasi". Mereka menggunakan berbagai aplikasi yang terpisah secara fundamental:

- **Tim Engineering** fokus pada Jira untuk tiket.
- **Tim HR** menggunakan Excel atau portal absen mandiri.
- **Eksekutif** menunggu laporan mingguan via Slack atau Google Sheets yang dikompilasi manual.

Kondisi ini menciptakan fragmen data di mana manajemen tidak memiliki visibilitas real-time terhadap korelasi antara kapasitas tim (HR) dan kecepatan pengiriman proyek (Engineering).

### 2.2 Akar Masalah

- **Fragmentasi Tools**: Peralihan antar-aplikasi (_Context Switching_) membuang 20-40% produktivitas harian.
- **Data Blind Spot**: Manajer tidak tahu siapa yang sedang _overload_ hingga burnout terjadi.
- **Respon Reaktif**: Insiden teknis ditangani tanpa standar SLA yang otomatis terpantau oleh pimpinan.
- **Misalignment**: Tugas harian seringkali tidak sinkron dengan tujuan strategis perusahaan (OKR).

### 2.3 Dampak Masalah

| Masalah           | Dampak Bisnis                                             | Estimasi Efek                               |
| :---------------- | :-------------------------------------------------------- | :------------------------------------------ |
| Silo Data         | Keputusan diambil berdasarkan data yang basi/outdated.    | Penurunan akurasi strategi sebesar 30%.     |
| Context Switching | Develover kehilangan fokus mendalam (_Deep Work_).        | Pengurangan output kode sebesar 2 jam/hari. |
| Burnout Karyawan  | _Turnover_ tinggi karena alokasi tugas yang tidak merata. | Biaya rekrutmen ulang yang mahal.           |
| Pelanggaran SLA   | Kehilangan kepercayaan klien/stakeholder.                 | Potensi penalti kontrak atau _churn_.       |

---

## 💡 Solusi (Solution Overview)

### 3.1 Pendekatan Vanguard

Vanguard didesain bukan hanya sebagai alat manajemen, melainkan sebagai **Command Center** (Pusat Komando). Filosofi desain kami mengutamakan kecepatan akses dan transparansi data menyeluruh melalui satu pintu tunggal.

### 3.2 Tiga Pilar Strategis

1.  **Alignment (OKR 2.0)**: Setiap tugas kecil dihubungkan langsung ke Objective perusahaan. Tim tahu "Kenapa" mereka mengerjakan sesuatu.
2.  **Velocity (Command Hub)**: Penggunaan _Command Palette_ (Cmd+K) memungkinkan perpindahan fitur dalam milidetik, menghilangkan hambatan UI tradisional.
3.  **Intelligence (Pulse Analytics)**: Laporan tidak lagi diminta, melainkan tersedia secara otomatis melalui sensor data aktual dari aktivitas tiket dan roster HR.

### 3.3 Bagaimana Vanguard Memecahkan Masalah

| Masalah Lama                  | Solusi Vanguard                                          |
| :---------------------------- | :------------------------------------------------------- |
| Laporan manual yang lambat.   | Dashboard real-time yang selalu sinkron dengan database. |
| Kapasitas tim yang misterius. | Integrasi langsung antara Roster HR dan alokasi proyek.  |
| Navigasi aplikasi yang rumit. | _Keyboard-first navigation_ dengan Vanguard Command Hub. |

---

## 🎯 Tujuan Pembuatan (Goals & Objectives)

### 4.1 Tujuan Teknis

- Membangun arsitektur monorepo yang **Scalable** dengan target uptime 99.9%.
- Memastikan **Latensi Interaksi** di bawah 100ms untuk pengalaman pengguna yang _snappy_.
- Implementasi **Granular RBAC** untuk keamanan tingkat tinggi.
- Sinkronisasi data real-time menggunakan **WebSockets**.
- **Audit Log** yang tidak dapat dimanipulasi untuk kepatuhan (_Compliance_).

### 4.2 Tujuan Bisnis

- Mengonsolidasi biaya langganan aplikasi (SaaS Optimization) dengan menyatukan 3-4 fungsi manajemen ke dalam 1 platform.
- Memberikan **Full Visibility** kepada C-Level sehingga rapat status mingguan bisa direduksi.
- Meningkatkan efisiensi kerja tim engineering hingga 25% melalui pengurangan _administrative overhead_.

---

## 💎 Manfaat (Benefits)

| Role                | Manfaat Utama                                  | KPI yang Meningkat               |
| :------------------ | :--------------------------------------------- | :------------------------------- |
| **C-Level**         | Visibilitas strategis tanpa _micromanagement_. | Strategic Goal Completion Rate   |
| **Project Manager** | Penugasan berbasis data kapasitas nyata.       | On-time Milestone Delivery       |
| **Developer**       | Fokus kerja tanpa gangguan navigasi rumit.     | Incident Resolution Speed (MTTR) |
| **HR Manager**      | Monitor beban kerja dan performa objektif.     | Employee Retention & Utilization |
| **Super Admin**     | Kontrol keamanan dan audit trail terpusat.     | Compliance & System Security     |

---

## 🗺️ Use Case Diagram

### 6.1 Deskripsi Use Case per Aktor

**Super Admin:**

- **UC-01**: Manajemen User & Role (RBAC).
- **UC-02**: Monitoring Audit Log Sistem.
- **UC-03**: Manajemen Pengaturan Global.

**Project Manager:**

- **UC-04**: Pembuatan Proyek & Milestone.
- **UC-05**: Alokasi Tim dari Roster HR.
- **UC-06**: Manajemen Incident Ticket & SLA.

**Developer / Engineer:**

- **UC-07**: Eksekusi Tiket & Update Progress.
- **UC-08**: Dokumentasi Resolusi Teknis.
- **UC-09**: Navigasi Cepat via Command Hub.

**HR Manager:**

- **UC-10**: Manajemen Database Karyawan.
- **UC-11**: Capacity & Workload Planning.
- **UC-12**: Objektif Performance Review.

**C-Level / Executive:**

- **UC-13**: Monitoring Dashboard Strategis.
- **UC-14**: Analisis SLA & Efisiensi Operasional.

### 6.2 Diagram Use Case (Mermaid)

```mermaid
graph LR
    subgraph "Aktor"
        ADMIN((Super Admin))
        PM((Project Manager))
        DEV((Developer))
        HR((HR Manager))
        EXEC((Executive))
    end

    subgraph "Vanguard System"
        subgraph "Project & Task"
            UC04[Buat Proyek]
            UC07[Update Progress]
        end
        subgraph "Incident Management"
            UC06[Kelola Tiket/SLA]
            UC08[Resolve Incident]
        end
        subgraph "HR Ops"
            UC10[Manajemen Roster]
            UC11[Capacity Planning]
        end
        subgraph "Governance"
            UC01[RBAC Control]
            UC02[Audit Logging]
        end
        subgraph "Intelligence"
            UC13[Strategy Dashboard]
        end
    end

    ADMIN --- UC01
    ADMIN --- UC02
    PM --- UC04
    PM --- UC06
    DEV --- UC07
    DEV --- UC08
    HR --- UC10
    HR --- UC11
    EXEC --- UC13
```

---

## 🔄 Sequence Diagram

### 7.1 Incident Ticket Lifecycle

```mermaid
sequenceDiagram
    participant DEV as Developer
    participant UI as Vanguard UI
    participant API as Fastify API
    participant DB as PostgreSQL
    participant SLA as Analytics Engine (SLA Monitoring)
    participant NOTIF as Notification Svc

    DEV->>UI: POST New Incident
    UI->>API: Create Ticket Request
    API->>DB: INSERT Ticket Data
    API->>SLA: Mark Creation Threshold
    API-->>UI: 201 Created
    API->>NOTIF: Push to PM
    NOTIF-->>UI: Toast: New High Incident
    PM->>API: Assign to Developer
    API->>DB: UPDATE Assignee
    API->>NOTIF: Push to Developer
    DEV->>API: PATCH Resolve Ticket
    API->>SLA: Validate Resolution Time
    API->>DB: UPDATE Status: CLOSED
    API->>NOTIF: Notify C-Level
```

### 7.3 HR Roster & Capacity Planning

```mermaid
sequenceDiagram
    participant HR as HR Manager
    participant API as API Server
    participant PE as Analytics Service
    participant DB as Database

    HR->>API: GET Capacity Planning View
    API->>DB: Query Employee + Project Joins
    API->>PE: Calculate Workload % (Aggregated)
    PE-->>API: Result: 85% Utilitarian
    API-->>HR: Render Workload Heatmap
    HR->>API: Assign Employee to Project
    API->>DB: Update Workspace Member
```

---

## 📈 Activity / Workflow Diagram

```mermaid
flowchart TD
    A[Start: User Access] --> B{Check Auth JWT}
    B -- Invalid --> C[Redirect to Login]
    B -- Valid --> D[Load Vanguard Hub]
    D --> E{User Role?}
    E -- Admin --> F[Governance & Audit]
    E -- PM --> G[Project & SLA Ops]
    E -- Dev --> H[Incident Queue]
    E -- HR --> I[Roster & Capacity]
    E -- Executive --> J[Strategic Pulse Dashboard]

    F & G & H & I & J --> K[Global Cmd+K Palette]
    K --> L[Real-time WebSocket Sync]
    L --> M[End Workflow]
```

---

## 🗄️ Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "creates"
    USERS ||--o{ INCIDENTS : "reports/assigned"
    USERS ||--|| EMPLOYEES : "has profile"
    PROJECTS ||--o{ MILESTONES : "contains"
    MILESTONES ||--o{ TASKS : "has"
    EMPLOYEES ||--o{ CAPACITY : "tracks"
    INCIDENTS ||--o{ INCIDENT_LOGS : "logs"
    ORGANIZATIONS ||--o{ USERS : "belongs to"

    USERS {
        uuid id
        string email
        string role
        status state
    }
    PROJECTS {
        uuid id
        string name
        date deadline
    }
    INCIDENTS {
        uuid id
        string severity
        boolean sla_met
    }
    EMPLOYEES {
        uuid id
        string department
        string position
    }
```

---

## 🏛️ Arsitektur Sistem

### 10.1 System Architecture Diagram

```mermaid
graph TD
    subgraph "Client Layer"
        Web[Next.js 14]
        Style[Tailwind CSS]
        State[Zustand]
    end

    subgraph "API Gateway"
        API[Fastify Node.js]
        Auth[JWT Identity]
    end

    subgraph "Logic & Services"
        SLA[SLA Tracking Engine]
        Notif[WebSocket Hub]
        Audit[Audit Service]
    end

    subgraph "Persistence"
        DB[(PostgreSQL)]
        Cache[(Redis)]
        Prisma[Prisma ORM]
    end

    Web <--> API
    API <--> Prisma
    Prisma <--> DB
    API <--> Cache
    API <--> SLA
    API <--> Notif
```

### 10.2 Deskripsi Komponen

| Komponen      | Teknologi  | Fungsi                              |
| :------------ | :--------- | :---------------------------------- |
| **Frontend**  | Next.js 14 | SSR/Static rendering & Dashboard UI |
| **Backend**   | Fastify    | High-throughput REST API            |
| **Real-time** | WebSockets | Push notifikasi & Live Updates      |
| **ORM**       | Prisma     | Type-safe Database access           |
| **Cache**     | Redis      | Session state & API Throttling      |

---

## 🚀 Fitur Lengkap (Feature List)

### Modul Project Management

| Fitur             | Deskripsi                                 | Akses    |
| :---------------- | :---------------------------------------- | :------- |
| Project Creator   | Membuat struktur projek dengan ID kustom. | PM/Admin |
| Milestone Tracker | Pelacakan fase pengerjaan visual.         | PM/Admin |
| Squad Allocator   | Menunjuk tim berdasarkan keahlian HR.     | PM/HR    |

### Modul Incident Hub

| Fitur            | Deskripsi                                   | Akses    |
| :--------------- | :------------------------------------------ | :------- |
| SLA Dashboard    | Monitoring resolusi tiket berdasarkan target. | [BETA] PM |
| Incident Log     | Audit trail untuk setiap perubahan tiket.   | Dev/PM    |
| Visual Priority  | Labeling otomatis (P0 - P3).                | PM        |

---

## 🛠️ Quick Start & Demo

### 11.1 Akses Langsung

**Production URL**: [https://nexus-ems-flame.vercel.app/](https://nexus-ems-flame.vercel.app/)

| Role                | Username (Demo)      | Password   |
| :------------------ | :------------------- | :--------- |
| **Super Admin**     | `admin@vanguard.dev` | `demo2026` |
| **Project Manager** | `pm@vanguard.dev`    | `demo2026` |
| **Developer**       | `dev@vanguard.dev`   | `demo2026` |
| **HR Manager**      | `hr@vanguard.dev`    | `demo2026` |
| **C-Level**         | `exec@vanguard.dev`  | `demo2026` |

### 11.2 Self-Hosted Setup

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/wi5nuu/Nexus-EMS.git
    pnpm install
    ```
2.  **Environment**:
    Salin `.env.example` ke `.env` dan isi kredensial database.
3.  **Spin Up DB**:
    ```bash
    docker-compose up -d
    ```
4.  **Init Database**:
    ```bash
    pnpm prisma migrate dev
    pnpm prisma db seed
    ```
5.  **Run Development**:
    ```bash
    pnpm dev
    ```
6.  **Akses Dashboard**: `http://localhost:3000`
7.  **Akses API Docs**: `http://localhost:8081/docs` (Swagger)

---

## ⚙️ Environment Variables

| Variable              | Fungsi                         | Required |
| :-------------------- | :----------------------------- | :------- |
| `DATABASE_URL`        | Koneksi String PostgreSQL      | ✅       |
| `REDIS_URL`           | Endpoint Redis Cache           | ✅       |
| `JWT_SECRET`          | Kunci enkripsi token identitas | ✅       |
| `NEXT_PUBLIC_API_URL` | URL Endpoint API Server        | ✅       |

### .env.example

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/vanguard"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="provide-a-secure-secret-here"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 🔐 Role & Permission Matrix

| Fitur / Aksi   | Admin | PM  | Dev | HR  | Exec |
| :------------- | :---: | :-: | :-: | :-: | :--: |
| Buat Proyek    |  ✅   | ✅  | ❌  | ❌  |  ❌  |
| Manage Roster  |  ✅   | ❌  | ❌  | ✅  |  ❌  |
| Resolve Ticket |  ✅   | ❌  | ✅  | ❌  |  ❌  |
| View Analytics |  ✅   | ❌  | ❌  | ❌  |  ✅  |
| Audit Log      |  ✅   | ❌  | ❌  | ❌  |  ❌  |

---

## ⏱️ SLA & Incident Severity Matrix

| Severity          | Target Response | Target Resolution | Alert To        |
| :---------------- | :-------------- | :---------------- | :-------------- |
| **P0 (Critical)** | 15 Menit        | 2 Jam             | Exec + PM + Dev |
| **P1 (High)**     | 1 Jam           | 8 Jam             | PM + Dev        |
| **P2 (Medium)**   | 4 Jam           | 24 Jam            | Dev             |

---

## 📈 Dampak & Nilai Bisnis (Business Impact)

### 16.1 Dampak Langsung

- **Meeting Reduction**: Mengurangi durasi rapat status koordinasi hingga **50%**.
- **Centralized Command**: Eliminasi perpindahan antar 3+ tools manajemen.

### 16.2 Return on Investment (ROI)

| Metrik           | Sebelum Vanguard | Sesudah Vanguard | Peningkatan |
| :--------------- | :--------------- | :--------------- | :---------- |
| Response Time    | 24+ Jam          | < 1 Jam          | **2400%**   |
| Manual Reporting | 4 Jam/Minggu     | 0 Jam (Auto)     | **100%**    |

---

## 🛣️ Roadmap

**v0.0.1 (Released)**

- ✅ Core Project, HR, & Incident Modules.
- ✅ Rebranding Vanguard Strategic Hub.

**v0.1.0 (Q2 2026)**

- 🔲 Module Goal Alignment (OKR Key Results).
- 🔲 Gantt Chart Interactive.

**v1.0.0 (Q4 2026)**

- 🔲 Multi-tenant Cloud Infrastructure.
- 🔲 AI predictive capacity analysis.

---

## 🤝 Contributing Guide

1.  **Branching**: Gunakan prefix `feat/`, `fix/`, atau `refactor/`.
2.  **Linting**: Wajib lolos `pnpm lint` sebelum membuat PR.
3.  **Review**: PR harus disetujui minimal oleh 1 architect.

---

## ⚖️ Legal & Lisensi

Copyright © 2026 **Wisnu Alfian Nur Ashar**.  
Dilisensikan secara **Proprietary**. Penggunaan tidak sah akan diproses secara hukum.

---

## ❓ FAQ

**1. Apakah ini siap untuk produksi?**  
Ya, build v0.0.1 sudah dirancang untuk standard enterprise.

**2. Bagaimana keamanan datanya?**  
Data dienkripsi dengan JWT dan dilindungi oleh role-based access yang ketat.

---
