# ☁️ Cloud-Based Test Automation Dashboard — Front-end

A **production-ready**, **cloud-hosted dashboard** built with **React**, **TypeScript**, and **Tailwind CSS**. It allows users to trigger and visualize **automated health-check tests** (CPU, memory, disk, services, containers, and more) on private infrastructure through a **secure, proxy-based architecture**.

This project demonstrates **real-world DevOps practices**, **modern web development**, and **secure cloud networking**.

---

## 🔗 Live Dashboard

👉 **[Open the Dashboard](http://13.51.175.115/)**  

---

## 🔍 Project Overview

- **Frontend Stack**: React 18, TypeScript, Tailwind CSS, Vite, Axios  
- **Backend Access**: Proxied via Nginx to a private EC2 (not exposed to the internet)  
- **Deployment**: Docker (multi-stage), Nginx, GitHub Actions CI/CD  
- **Architecture**: Two EC2 instances in the same AWS VPC  
  - Frontend: Public  
  - Backend: Private  

---

## 🔐 How It Works

1. User accesses the **public front-end EC2 instance** via browser.
2. The **React app** sends requests to `/api/...`.
3. **Nginx** on the frontend intercepts and proxies `/api/...` to the **private backend EC2** instance.
4. The **backend executes Python/Bash scripts** and returns JSON results.
5. React displays **PASS/FAIL status**, durations, logs, and statistics in real-time.

---

## ✅ Key Features

- 🚀 Run system health checks with a single click  
- 📊 Real-time results with **PASS/FAIL** indicators  
- 🧾 Expandable log output for each test  
- 📋 Summary cards for test statistics  
- 📱 Responsive design (desktop + mobile)  
- ⚠️ Smooth error handling and loading states  
- 🔐 **Zero CORS issues** due to internal proxying

---

## 🛠 Tooling & Infrastructure

- ⚛️ **React + Vite** for high-performance SPA  
- 🎨 **Tailwind CSS** for responsive styling  
- 🐳 **Docker multi-stage build** for production optimization  
- 🌐 **Nginx** for static file serving & reverse proxy  
- 🔄 **GitHub Actions** for automated CI/CD  
- ☁️ **AWS EC2**:  
  - Frontend: Public  
  - Backend: Private (same VPC)  
- 🔗 **Internal VPC communication** for secure API access

---

## 🔄 CI/CD Pipeline

- Triggered on every push to `main`  
- GitHub Actions:  
  - Builds Docker image  
  - SSH into front-end EC2  
  - Stops old container  
  - Pulls latest code  
  - Rebuilds and runs updated image  
  - Pings health endpoint for validation

---

## 🔗 Backend Repository

All test logic and APIs are implemented separately:  
👉 [Backend Repo](https://github.com/Abaidullah889/Cloud-Based-Test-Automation-Dashboard-Backened)

---

## 📈 Use Cases

- ✅ Cloud system readiness and smoke testing  
- 🧰 Internal DevOps tools  
- 💼 Full-stack + cloud portfolio project  
- 🔐 Secure monitoring dashboard for virtual infra

---

## 👨‍💻 Author

Built by **Abaidullah Asif**  
Feel free to **fork**, **star**, or **connect on [LinkedIn](https://www.linkedin.com/in/abaidullahasif/)** for feedback or collaboration.

---
