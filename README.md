# C++ Lab Report Assistant 📝

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%20Flash-8e75b2)

A modern, AI-powered web application designed to streamline the creation of academic C++ lab reports. Built with React and Google's Gemini AI, this tool analyzes your code and generates structured, submission-ready reports with discussions, output placeholders, and proper formatting.

## ✨ Features

- **🤖 AI-Powered Analysis**: Uses Google's Gemini 3 Flash model to generate academic discussions and output descriptions for your C++ code.
- **🌗 Dark & Light Mode**: A fully responsive UI with a toggleable dark/light theme to suit your preference.
- **📚 Multi-Problem Support**: Add as many problems as needed for a single lab session.
- **🔗 Codeforces Integration**: dedicated field to include your Codeforces submission links.
- **📝 Live Preview**: View the generated report in a rendered Markdown format or switch to raw text for easy copying.
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google GenAI SDK (@google/genai)
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get one [here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/cpp-lab-assistant.git
    cd cpp-lab-assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *(Note: In some build environments like Vite, you may need to prefix variables or handle them via specific config files).*

4.  **Run the application**
    ```bash
    npm run dev
    ```

## 📖 How to Use

1.  **Enter Lab Details**: Fill in the Lab Number, Lab Title, and an optional Codeforces submission link in the sidebar.
2.  **Add Problems**:
    *   Enter a title for the problem.
    *   (Optional) Paste the problem description.
    *   Paste your C++ source code into the editor.
    *   Click "Add Another Problem" to include more tasks in the same report.
3.  **Generate**: Click the "Generate Report" button in the header.
4.  **Review & Copy**: Once processed, the AI will generate the report. You can view the formatted result or switch to the "Markdown" tab to copy the raw text.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <b>Made with love by PRONOB ❤️</b>
</div>
