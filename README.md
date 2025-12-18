# 🤖 AlienX AI - Multi-Agent Productivity Platform

<div align="center">

![AlienX AI Banner](https://img.shields.io/badge/AlienX-AI%20Platform-blueviolet?style=for-the-badge&logo=openai)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**An intelligent, autonomous AI agent ecosystem that transforms how you work, communicate, and create.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Agents](#-intelligent-agents) • [Demo](#-demo)

</div>

---

## 🌟 Overview

AlienX AI is a cutting-edge multi-agent productivity platform that leverages advanced AI models to automate and enhance various aspects of your workflow. From handling emails and calls to generating documents, images, and presentations, AlienX AI acts as your intelligent digital assistant, available 24/7.

### Why AlienX AI?

- 🚀 **15+ Specialized AI Agents** - Each optimized for specific tasks
- ⚡ **Real-time Processing** - Instant responses with background task handling
- 🔒 **Secure & Private** - Supabase-powered authentication and storage
- 🎨 **Beautiful UI** - Modern, responsive interface built with React + Tailwind
- 📱 **Multi-Platform** - WhatsApp integration for mobile access
- 🧠 **Context-Aware** - Agents learn and adapt to your preferences

---

## ✨ Features

### 🤝 Core Capabilities

| Feature | Description |
|---------|-------------|
| **Smart Email Management** | Auto-categorize, draft replies, and schedule follow-ups |
| **Intelligent Call Handling** | Auto-attend, record, transcribe, and summarize meetings |
| **Document Generation** | Create reports, proposals, and content in your tone |
| **Visual Content Creation** | Generate images, flowcharts, and presentations |
| **Research Assistant** | Deep-dive research with source compilation and summaries |
| **Data Visualization** | Beautiful charts and plots from raw data |
| **Case Study Builder** | Professional case studies with metrics and quotes |
| **Brainstorming Partner** | Generate ideas, wireframes, and creative concepts |
| **Cloud Storage** | Organized file management with Supabase backend |
| **WhatsApp Integration** | Control agents via WhatsApp messages |

### 🎯 Fast Mode

Execute multiple agent tasks simultaneously with our powerful **Fast Mode** interface:
- Queue multiple agents in a single conversation
- Real-time progress tracking
- Parallel task execution
- Results organized by task

---

## 🛠 Tech Stack

### Frontend
```
⚛️  React 18 + Vite
🎨 Tailwind CSS + shadcn/ui
🎭 Framer Motion (Animations)
📊 Recharts (Data Visualization)
🔥 Supabase Client
📝 React Markdown
```

### Backend
```
🐍 Python 3.9+ (Flask)
🤖 Google Gemini AI
🧠 Perplexity AI (Research)
🖼️  DALL-E / Stable Diffusion
📧 Mailgun (Email)
📞 Twilio (Calls/WhatsApp)
💾 Supabase (Database & Storage)
```

### Infrastructure
```
☁️  Supabase (PostgreSQL + Storage)
🚀 Vercel (Frontend Deployment)
🔐 JWT Authentication
📦 Environment-based Configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Supabase** account
- API keys for:
  - Google Gemini
  - Perplexity (optional)
  - Mailgun (for email features)
  - Twilio (for WhatsApp features)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/RICH-KEED/Bianca-Prototype.git
cd AlienX-AI
```

#### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file in root directory
cp .env.example .env

# Add your API keys to .env
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
MAILGUN_API_KEY=your_mailgun_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
PERPLEXITY_API_KEY=your_perplexity_key
```

#### 3. Frontend Setup
```bash
cd AlienX-AI-refined

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your keys
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### 4. Supabase Configuration

Run the SQL setup script in your Supabase SQL Editor:
```sql
-- See AlienX-AI-refined/SUPABASE_SETUP.sql for complete schema
CREATE TABLE user_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  credits INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('drive', 'drive', true);
```

#### 5. Start Development Servers

**Backend:**
```bash
# From root directory
python test_server.py
# Server runs on http://localhost:5001
```

**Frontend:**
```bash
# From AlienX-AI-refined directory
npm run dev
# App runs on http://localhost:5173
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AlienX AI Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │◄───────►│   Backend    │                  │
│  │  React + UI  │  REST   │ Flask + AI   │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │                        │                           │
│  ┌──────▼────────────────────────▼───────┐                  │
│  │         Supabase Platform              │                  │
│  ├────────────────────────────────────────┤                  │
│  │  • PostgreSQL Database                 │                  │
│  │  • Storage (Images, Docs, Files)       │                  │
│  │  • Authentication & Authorization      │                  │
│  └────────────────────────────────────────┘                  │
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │         AI Agent Layer                  │                 │
│  ├─────────────────────────────────────────┤                 │
│  │  Email │ Call │ Document │ Image        │                 │
│  │  Research │ Flowchart │ Presentation    │                 │
│  │  Case Study │ Summary │ Brainstorm      │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
│  ┌─────────────────────────────────────────┐                 │
│  │      External Integrations              │                 │
│  ├─────────────────────────────────────────┤                 │
│  │  Gemini │ Perplexity │ Mailgun         │                 │
│  │  Twilio │ WhatsApp │ Cloud Storage     │                 │
│  └─────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Intelligent Agents

### Communication Agents
| Agent | Status | Description |
|-------|--------|-------------|
| **Email Agent** | ✅ Active | Inbox management, drafting, follow-up tracking |
| **Call Agent** | ✅ Active | Auto-attend, record, transcribe meetings |
| **WhatsApp Agent** | 🚧 Beta | Message automation, smart replies |

### Content Creation Agents
| Agent | Status | Description |
|-------|--------|-------------|
| **Document Agent** | ✅ Active | Reports, proposals, articles in your tone |
| **Image Agent** | ✅ Active | AI-generated visuals and mockups |
| **Flowchart Agent** | ✅ Active | Process diagrams and visual workflows |
| **Presentation Agent** | ✅ Active | Slide decks with speaker notes |
| **Case Study Agent** | ✅ Active | Professional case studies with metrics |

### Productivity Agents
| Agent | Status | Description |
|-------|--------|-------------|
| **Research Agent** | ✅ Active | Deep research with citations |
| **Summary Agent** | ✅ Active | Condense documents and threads |
| **Brainstorm Agent** | ✅ Active | Idea generation and wireframes |
| **Calendar Agent** | ✅ Active | Schedule management and reminders |
| **Data Visualization** | ✅ Active | Charts, plots, and analytics |

### Planned Agents
- 📋 Task Board Agent
- ✅ Checklist Agent  
- 📄 Document-to-PDF Agent (OCR)
- 🔄 Automation Agent
- 📰 Interest News Agent
- 🎓 Exam Blueprint Agent

---

## 📁 Project Structure

```
AlienX-AI/
├── agents/                      # AI Agent modules
│   ├── base_agent.py           # Base agent class
│   ├── email_agent.py          # Email management
│   ├── call_agent.py           # Call handling
│   ├── document_agent.py       # Document generation
│   ├── image_agent.py          # Image creation
│   ├── research_agent.py       # Research assistant
│   ├── flowchart_agent.py      # Flowchart generation
│   ├── presentation_agent.py   # Slide deck creation
│   ├── case_study_agent.py     # Case study builder
│   ├── summary_agent.py        # Content summarization
│   ├── brainstorm_agent.py     # Brainstorming partner
│   ├── calendar_agent.py       # Calendar management
│   └── plotting_agent_matplotlib.py  # Data visualization
│
├── AlienX-AI-refined/          # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Sidebar.jsx    # Navigation
│   │   │   ├── FileExplorer.jsx  # Cloud storage UI
│   │   │   └── LoadingScreen.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── FastMode.jsx   # Multi-agent interface
│   │   │   ├── Data.jsx       # File management
│   │   │   └── Auth/          # Authentication
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities
│   │   └── supabase.js        # Supabase client
│   │
│   └── public/                # Static assets
│
├── storage/                    # Local file organization
│   ├── images/
│   ├── documents/
│   ├── flowcharts/
│   ├── presentations/
│   ├── research/
│   └── case_studies/
│
├── test_server.py             # Flask backend server
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

---

## 💻 Usage Examples

### Fast Mode - Multi-Agent Execution

```javascript
// Example: Research + Document + Presentation
User: "Research AI trends in 2024, create a report, 
      and make a 5-slide presentation"

AlienX AI:
✅ Research Agent → Gathering insights...
✅ Document Agent → Writing report...
✅ Presentation Agent → Creating slides...

Results delivered in <2 minutes!
```

### Quick Start - Command Line

Generate images from the command line:
```bash
# Simple usage
python run_image_agent.py "A sunset over mountains"

# With style and aspect ratio
python run_image_agent.py "Modern AI assistant" --style professional --ratio 16:9

# Custom filename
python run_image_agent.py "Quote card" --style minimalist --ratio 1:1 --output my_quote
```

### Email Agent via API

```python
POST /api/execute-agent
{
  "agent": "email",
  "user_phone": "+1234567890",
  "params": {
    "action": "draft_reply",
    "to": "client@example.com",
    "context": "Follow up on proposal"
  }
}
```

### Image Generation

```python
POST /api/execute-agent
{
  "agent": "image",
  "user_phone": "+1234567890",
  "params": {
    "prompt": "Modern tech startup office, minimalist design",
    "style": "professional"
  }
}
```

---

## 🎨 Demo

### Dashboard
![Dashboard Preview](https://via.placeholder.com/800x400?text=AlienX+AI+Dashboard)

### Fast Mode Interface
![Fast Mode](https://via.placeholder.com/800x400?text=Fast+Mode+Multi-Agent+Execution)

### File Explorer
![File Explorer](https://via.placeholder.com/800x400?text=Cloud+Storage+File+Manager)

---

## 🔒 Security & Privacy

- **End-to-End Encryption** for sensitive data
- **JWT-based Authentication** with Supabase
- **Role-based Access Control** (RBAC)
- **API Rate Limiting** to prevent abuse
- **Secure Environment Variables** for API keys
- **HTTPS-only** in production
- **Data Isolation** per user with row-level security

---

## 🚦 Roadmap

### Phase 1: Core Foundation ✅
- [x] Multi-agent architecture
- [x] React frontend with Tailwind
- [x] Supabase integration
- [x] Basic agent implementations

### Phase 2: Enhanced Features ✅
- [x] Fast Mode (multi-agent execution)
- [x] Cloud storage with folder structure
- [x] WhatsApp integration
- [x] Real-time progress tracking

### Phase 3: Advanced Capabilities 🚧
- [ ] Task board & checklist agents
- [ ] Automation workflows
- [ ] Mobile app (React Native)
- [ ] Voice interface
- [ ] Advanced analytics dashboard

### Phase 4: Enterprise Features 📋
- [ ] Team collaboration
- [ ] API marketplace
- [ ] Custom agent builder
- [ ] On-premise deployment option

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Perplexity AI** for research features
- **Supabase** for backend infrastructure
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for styling framework
- **React** ecosystem and community

---

## 📧 Contact & Support

- **GitHub**: [@RICH-KEED](https://github.com/RICH-KEED)
- **Repository**: [Bianca-Prototype](https://github.com/RICH-KEED/Bianca-Prototype)
- **Issues**: [Report a Bug](https://github.com/RICH-KEED/Bianca-Prototype/issues)
- **Discussions**: [Join the Community](https://github.com/RICH-KEED/Bianca-Prototype/discussions)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the AlienX AI Team

[![GitHub stars](https://img.shields.io/github/stars/RICH-KEED/Bianca-Prototype?style=social)](https://github.com/RICH-KEED/Bianca-Prototype)
[![GitHub forks](https://img.shields.io/github/forks/RICH-KEED/Bianca-Prototype?style=social)](https://github.com/RICH-KEED/Bianca-Prototype/fork)

</div>


