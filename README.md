# MathEncode 🧮✨

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.13.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

> **Transforming Math Education Through Personalized Learning** 📈

MathEncode is a modern, full-stack educational platform that revolutionizes math learning for students in grades K-12. Founded by Chirag Dang (NIT Jalandhar), our platform combines innovative teaching methodologies with cutting-edge technology to make mathematics accessible, engaging, and effective for every student.

## 🌟 Key Features

- **🎯 Personalized Learning Plans** - Adaptive curriculum tailored to individual learning styles
- **👨‍🏫 Expert Instruction** - Led by experienced educators with proven track records
- **📊 Progress Tracking** - Comprehensive monthly reports and real-time analytics
- **🏆 Competition Prep** - Specialized training for Math Olympiads and competitive exams
- **🎥 Video Testimonials** - Real student success stories and transformations
- **📱 Responsive Design** - Seamless experience across all devices
- **🚀 Modern Tech Stack** - Built with React, Node.js, and MongoDB

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App] --> B[React Router]
        A --> C[TailwindCSS]
        A --> D[Lucide Icons]
    end
    
    subgraph "Backend Layer"
        E[Express Server] --> F[MongoDB]
        E --> G[CORS Middleware]
        E --> H[Body Parser]
    end
    
    subgraph "Deployment"
        I[Vercel Frontend] --> J[Production Build]
        K[Server Hosting] --> L[Environment Variables]
    end
    
    A --> E
    E --> F
    I --> K
    
    style A fill:#61DAFB,color:#000
    style E fill:#339933,color:#fff
    style F fill:#47A248,color:#fff
    style I fill:#000,color:#fff
```

## 🎓 Learning Journey Flow

```mermaid
flowchart TD
    A[Student Enrollment] --> B[Assessment & Placement]
    B --> C{Grade Level?}
    
    C -->|K-5| D[Elementary Foundation]
    C -->|6-8| E[Middle School Math]
    C -->|9-10| F[Algebra Mastery]
    C -->|11-12| G[Advanced Mathematics]
    
    D --> H[Personalized Learning Plan]
    E --> H
    F --> H
    G --> H
    
    H --> I[One-on-One Sessions]
    I --> J[Progress Assessment]
    J --> K{Goals Achieved?}
    
    K -->|No| L[Adaptive Adjustments]
    L --> H
    K -->|Yes| M[Advanced Level Preparation]
    M --> N[Competition Training]
    N --> O[Success & Recognition]
    
    style A fill:#FF6700,color:#fff
    style H fill:#10B981,color:#fff
    style O fill:#F59E0B,color:#000
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **MongoDB** Atlas account or local installation
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mathencode.git
   cd mathencode
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathencode
   PORT=5000
   NODE_ENV=production
   ```

5. **Start the development servers**
   
   **Frontend** (Terminal 1):
   ```bash
   npm run dev
   # Runs on http://localhost:5173
   ```
   
   **Backend** (Terminal 2):
   ```bash
   cd server
   npm run dev
   # Runs on http://localhost:5000
   ```

## 📁 Project Structure

```
mathencode/
├── 📁 public/                    # Static assets
│   ├── 🖼️ favicon.png
│   ├── 🖼️ hero-boy.png
│   ├── 🖼️ hero-girl.png
│   ├── 🖼️ founder.png
│   ├── 🖼️ logo_color.svg
│   ├── 🖼️ logo_white.svg
│   └── 📁 assets/videos/         # Student testimonial videos
├── 📁 src/                       # Frontend source code
│   ├── 📄 App.jsx               # Main app component
│   ├── 📄 main.jsx              # Application entry point
│   ├── 🎨 index.css             # Global styles
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📄 Hero.jsx          # Landing section
│   │   ├── 📄 Founder.jsx       # Instructor profile
│   │   ├── 📄 UniqueApproach.jsx # Teaching methodology
│   │   ├── 📄 Courses.jsx       # Program offerings
│   │   ├── 📄 Testimonial.jsx   # Student success stories
│   │   ├── 📄 ContactForm.jsx   # Lead generation form
│   │   └── 📄 ContactFormPopup.jsx # Demo booking modal
│   ├── 📁 layout/               # Layout components
│   │   ├── 📄 Navbar.jsx        # Navigation header
│   │   └── 📄 Footer.jsx        # Site footer
│   └── 📁 pages/                # Page components
│       ├── 📄 Home.jsx          # Main landing page
│       └── 📄 FormData.jsx      # Admin dashboard
├── 📁 server/                    # Backend API
│   ├── 📄 index.js              # Express server setup
│   └── 📄 package.json          # Server dependencies
├── ⚙️ vite.config.js            # Vite configuration
├── ⚙️ tailwind.config.js        # TailwindCSS configuration
├── ⚙️ postcss.config.js         # PostCSS configuration
├── ⚙️ eslint.config.js          # ESLint configuration
├── 🚀 vercel.json               # Vercel deployment config
└── 📋 package.json              # Project dependencies
```

## 🎨 Tech Stack Deep Dive

### Frontend Technologies
- **⚛️ React 18.2.0** - Modern UI library with hooks and concurrent features
- **⚡ Vite 4.4.5** - Lightning-fast build tool and dev server
- **🎨 TailwindCSS 3.3.3** - Utility-first CSS framework for rapid styling
- **🧭 React Router 6.15.0** - Declarative routing for single-page applications
- **🎭 Lucide React** - Beautiful, customizable icon library
- **📱 React Icons 5.5.0** - Popular icon libraries as React components

### Backend Technologies
- **🚀 Node.js & Express 4.21.2** - Fast, minimalist web framework
- **🍃 MongoDB 8.13.1** - NoSQL database for flexible data storage
- **🌐 CORS 2.8.5** - Cross-origin resource sharing middleware
- **🔧 Body Parser 2.2.0** - Request body parsing middleware
- **🔒 Dotenv 16.4.7** - Environment variable management

### Development Tools
- **🔍 ESLint 8.45.0** - Static code analysis and linting
- **🔄 Nodemon 3.1.9** - Automatic server restart during development
- **📦 PostCSS 8.4.28** - CSS transformation and optimization
- **🎯 Autoprefixer 10.4.15** - Automatic CSS vendor prefixing

## 💻 Development Workflow

### Available Scripts

**Frontend Commands:**
```bash
npm run dev      # Start development server (port 5173)
npm run build    # Create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint code analysis
```

**Backend Commands:**
```bash
cd server
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Code Quality & Standards

- **📏 ESLint Configuration** - Enforces consistent code style
- **🎨 Prettier Integration** - Automatic code formatting
- **📝 Component Documentation** - JSDoc comments for complex functions
- **🧪 Error Boundaries** - Graceful error handling in React components

## 🎯 Core Components

### 1. Hero Section (`Hero.jsx`)
- **Dynamic Image Rotation** - Alternating student photos every 3.5 seconds
- **Call-to-Action Buttons** - Demo booking and course exploration
- **Feature Highlights** - Key benefits with checkmark icons
- **Responsive Design** - Mobile-first approach with grid layouts

### 2. Founder Profile (`Founder.jsx`)
- **Professional Credentials** - B.Tech NIT Jalandhar, 4+ years experience
- **Student Success Metrics** - 50+ students taught, proven results
- **Achievement Badges** - Visual representation of expertise
- **Personal Touch** - Humanizes the learning experience

### 3. Teaching Methodology (`UniqueApproach.jsx`)
- **Six Core Principles** - Conceptual clarity, personalization, problem-solving
- **Color-Coded Cards** - Visual distinction for different approaches
- **Interactive Hover Effects** - Enhanced user engagement
- **Comprehensive Coverage** - From basics to advanced concepts

### 4. Course Catalog (`Courses.jsx`)
- **Three Main Programs** - Elementary, Middle School, Advanced
- **Detailed Specifications** - Duration, group size, key topics
- **Progressive Difficulty** - Structured learning pathways
- **Visual Hierarchy** - Clear information architecture

### 5. Student Testimonials (`Testimonial.jsx`)
- **Video Integration** - Real student success stories
- **Academic Achievements** - Grade improvements and competition wins
- **Social Proof** - Builds trust and credibility
- **Responsive Carousel** - Smooth mobile experience

## 📊 Performance Metrics

### Student Success Statistics
- **90%+** students achieve A grades (90% or above)
- **50+** students successfully taught to date
- **Multiple** Math Olympiad and competition winners
- **4+ years** of proven teaching experience

### Technical Performance
- **⚡ Fast Loading** - Vite's optimized bundle splitting
- **📱 Mobile-First** - Responsive design across all devices
- **🚀 SEO Optimized** - Semantic HTML and meta tags
- **♿ Accessible** - WCAG compliance for inclusive design

## 🌐 Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        A[Local Development] --> B[Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        B --> C[Vercel Build]
        C --> D[Automated Testing]
        D --> E[Production Deployment]
    end
    
    subgraph "Production Environment"
        E --> F[Vercel CDN]
        F --> G[Global Edge Network]
        G --> H[End Users]
    end
    
    subgraph "Backend Services"
        I[MongoDB Atlas] --> J[Express API]
        J --> K[Contact Form Handler]
    end
    
    F --> J
    
    style A fill:#FF6700,color:#fff
    style E fill:#000,color:#fff
    style F fill:#000,color:#fff
    style I fill:#47A248,color:#fff
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### TailwindCSS Configuration (`tailwind.config.js`)
- **Custom Color Palette** - Brand-specific colors (primary, secondary, accent)
- **Extended Spacing** - Consistent layout spacing system
- **Custom Fonts** - Montserrat for headings, system fonts for body
- **Responsive Breakpoints** - Mobile, tablet, desktop optimization

## 🚀 Getting Started for Contributors

### Development Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Install dependencies** (`npm install` in both root and server directories)
5. **Start development servers** (frontend and backend)
6. **Make your changes** with proper testing
7. **Commit your changes** (`git commit -m 'Add amazing feature'`)
8. **Push to branch** (`git push origin feature/amazing-feature`)
9. **Open a Pull Request** with detailed description

### Coding Standards
- **React Best Practices** - Functional components with hooks
- **Component Structure** - Props validation and default values
- **CSS Organization** - TailwindCSS utility classes
- **File Naming** - PascalCase for components, camelCase for utilities
- **Git Workflow** - Conventional commits and descriptive messages

## 📞 Contact & Support

- **📧 Email:** [learn@mathencode.com](mailto:learn@mathencode.com)
- **📱 Phone:** [+91 73570 16611](tel:+917357016611)
- **🌐 Website:** [mathencode.com](https://mathencode.com)
- **👨‍💼 Founder:** Chirag Dang (B.Tech NIT Jalandhar)

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Students & Parents** - For trusting us with their mathematical journey
- **Educational Community** - For inspiration and continuous improvement
- **Open Source Contributors** - For making this platform possible
- **NIT Jalandhar** - For foundational engineering education

---

<div align="center">

**Made with ❤️ by the MathEncode Team**

*Transforming Math Education, One Student at a Time* 🎓✨

[![Follow on GitHub](https://img.shields.io/github/followers/yourusername?style=social)](https://github.com/yourusername)
[![Star this repo](https://img.shields.io/github/stars/yourusername/mathencode?style=social)](https://github.com/yourusername/mathencode)

</div>
