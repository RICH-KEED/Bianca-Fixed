# AI Agent Ecosystem

AI agents that work together to handle different tasks.

## Agents Built
- ✅ Flowchart Agent - Creates Mermaid flowcharts
- ✅ Email Agent - Drafts and sends emails
- ✅ Call Agent - Handles phone conversations
- ✅ Research Agent - Web research with Perplexity
- ✅ Image Agent - Generates images from text prompts with AI

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup Environment
Create `.env` file:
```env
GEMINI_API_KEY=your_key
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=your_domain
FROM_EMAIL=your_email
PERPLEXITY_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_phone
```

### 3. Run Test Server
```bash
python test_server.py
```

### 4. Open Dashboard
Open `frontend/index.html` in browser

## Usage

Dashboard has agent tabs:
- **Flowchart** - Describe process → Get flowchart
- **Email** - Describe email → Get draft
- **Research** - Ask question → Get research with sources
- **Image** - Describe image → Get AI-generated visual

Each agent shows output in real-time!

### Image Agent Quick Start

Generate images from the command line:
```bash
# Simple usage
python run_image_agent.py "A sunset over mountains"

# With style and aspect ratio
python run_image_agent.py "Modern AI assistant" --style professional --ratio 16:9

# Custom filename
python run_image_agent.py "Quote card" --style minimalist --ratio 1:1 --output my_quote
```

See `agents/IMAGE_AGENT_README.md` for detailed documentation.


