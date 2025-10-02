# AI-Powered Interview Assistant

A fully functional interview management system with AI-powered question generation, resume parsing, and candidate evaluation.

## Features

- **Resume Upload & Parsing**: Automatically extracts candidate information from PDF/DOCX resumes
- **AI Question Generation**: Generates React/Node.js coding questions using OpenAI GPT-3.5-turbo
- **Timer-Based Interviews**: 6 questions with difficulty-based time limits (Easy: 20s, Medium: 60s, Hard: 120s)
- **AI Answer Evaluation**: Intelligent scoring and detailed feedback using OpenAI
- **Recruiter Dashboard**: View all candidates, search, sort, and review detailed performance
- **State Persistence**: All data persists in localStorage using Zustand
- **Session Management**: "Welcome Back" modal to continue or restart sessions

## Setup

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your OpenAI API key to `.env.local`:

\`\`\`env
OPENAI_API_KEY=sk-your-api-key-here
\`\`\`

**Get your API key**: https://platform.openai.com/api-keys

**Note**: The app will work without an API key using fallback questions and mock evaluation, but AI features will be disabled.

### 3. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Candidates (Interviewee Tab)

1. Upload your resume (PDF or DOCX)
2. Verify extracted information
3. Click "Start Interview" to begin
4. Answer 6 coding questions within time limits
5. View your score and detailed feedback

### For Recruiters (Interviewer Tab)

1. View all candidates in the dashboard
2. Search by name, email, or phone
3. Sort by score, date, or status
4. Click on any candidate to view detailed performance
5. Review answers, time spent, and AI-generated feedback

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Zustand with localStorage persistence
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: OpenAI GPT-3.5-turbo
- **PDF Parsing**: pdfjs-dist
- **DOCX Parsing**: mammoth

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── generate-questions/   # AI question generation
│   │   ├── parse-resume/          # Resume parsing
│   │   └── evaluate-answers/      # AI answer evaluation
│   ├── page.tsx                   # Main app with tabs
│   └── layout.tsx                 # Root layout
├── components/
│   ├── interviewee-tab.tsx        # Candidate interview interface
│   ├── interviewer-tab.tsx        # Recruiter dashboard
│   ├── question-timer.tsx         # Timer component
│   └── ...                        # Other UI components
├── lib/
│   └── store.ts                   # Zustand store with persistence
└── .env.example                   # Environment variables template
\`\`\`

## Features in Detail

### Resume Parsing
- Supports PDF and DOCX formats
- Extracts name, email, and phone number
- Uses regex patterns for reliable data extraction

### AI Question Generation
- Generates 6 questions: 2 Easy, 2 Medium, 2 Hard
- Focuses on React and Node.js topics
- Fallback to predefined questions if API key is missing

### Timer System
- Accurate countdown with visual indicators
- Auto-submit when time expires
- Tracks time spent per question
- Red warning when < 25% time remaining

### AI Evaluation
- Analyzes answer quality and completeness
- Provides numerical score (0-100)
- Generates detailed feedback with strengths and improvements
- Considers time management in evaluation

### Data Persistence
- All data stored in localStorage
- Survives page refreshes and browser restarts
- "Welcome Back" modal for session recovery
- Option to continue or start fresh

## License

MIT
