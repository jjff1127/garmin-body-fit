# Garmin Body Fit Generator

A modern, glassmorphic web application to generate Garmin-compatible `.fit` files from body composition data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/framework-Next.js%2014-black.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## ✨ Features

- **Accurate .fit Generation**: Uses `@garmin/fitsdk` with precise scaling for weight, BMI, and body metrics.
- **Modern UI**: Dark-themed, glassmorphic design for a premium user experience.
- **Multilingual Support**: Real-time switching between **English**, **Spanish**, and **Chinese**.
- **Edge/Chrome Compatible**: Optimized download logic to handle browser security policies for blob files.
- **Dockerized**: Easy to deploy and run in any environment.

## 🚀 Quick Start with Docker

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd garmin-body-fit
   ```

2. **Start the application**:
   ```bash
   docker compose up -d
   ```

3. **Access the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser (Edge recommended for local dev).

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Inter Font.
- **SDK**: Official `@garmin/fitsdk`.
- **Styling**: Vanilla CSS with CSS Variables and Glassmorphism.

## 📊 FIT Data Mapping Details

| Metric | Factor | Unit |
| :--- | :--- | :--- |
| **Weight** | x100 | kg |
| **BMI** | Direct | - |
| **Fat %** | Direct | % |
| **Water %** | Direct | % |
| **Muscle Mass** | Direct | kg |
| **Bone Mass** | Direct | kg |
| **Visceral Fat**| Direct | 1-59 |

## 📝 Usage

1. Select your preferred language in the top-right corner.
2. Enter your body measurement data (Weight is required).
3. Click "Generate & Download .fit".
4. Upload the generated file to [Garmin Connect](https://connect.garmin.com/modern/import-data).

---
Developed for reliable Garmin body data management.
