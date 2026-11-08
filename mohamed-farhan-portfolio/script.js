
// Persistent light/dark theme toggle. Dark is the default theme.
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeLabel = themeToggle?.querySelector('.theme-label');
const savedTheme = (() => { try { return localStorage.getItem('farhan-portfolio-theme'); } catch { return null; } })();
if (savedTheme === 'light' || savedTheme === 'dark') document.body.dataset.theme = savedTheme;
function syncThemeControl() {
  const isLight = document.body.dataset.theme === 'light';
  if (themeIcon) themeIcon.textContent = isLight ? '☾' : '☼';
  if (themeLabel) themeLabel.textContent = isLight ? 'DARK' : 'LIGHT';
  if (themeToggle) {
    const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f5f4ef' : '#080b10');
}
syncThemeControl();
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = nextTheme;
  try { localStorage.setItem('farhan-portfolio-theme', nextTheme); } catch { /* Storage may be unavailable; theme still works for this visit. */ }
  syncThemeControl();
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const projects = {
  'data-poc': {
    kicker: 'ENTERPRISE AI · PROFESSIONAL WORK',
    title: 'Multi-Agent Data Engineering POC',
    summary: 'A proof of concept built around four Context Agents to support data engineering workflows. The demonstration secured stakeholder approval for project implementation.',
    overview: 'The POC explored how context-aware agents can support enterprise data engineering tasks. It was designed as a coordinated agent workflow rather than a single-purpose assistant.',
    contribution: ['Designed and developed a POC comprising four Context Agents.', 'Demonstrated the solution to stakeholders and secured approval for implementation.', 'Focused the work on practical enterprise Data Engineering workflows.'],
    stack: ['Agentic AI', 'Context Agents', 'Python', 'Data Engineering']
  },
  'speech-api': {
    kicker: 'AI · BACKEND',
    title: 'Speaker Diarization & Transcription API',
    summary: 'A FastAPI-based service that combines speech transcription with multi-speaker diarization.',
    overview: 'The application accepts audio for processing and uses Whisper for transcription alongside pyannote.audio for identifying and separating speakers. FastAPI exposes the functionality through REST endpoints.',
    contribution: ['Built the backend API using FastAPI and Python.', 'Integrated Whisper for speech transcription.', 'Used pyannote.audio for multi-speaker diarization.'],
    stack: ['Python', 'FastAPI', 'Whisper', 'pyannote.audio', 'REST API']
  },
  'recommendation': {
    kicker: 'GENERATIVE AI · RECOMMENDATION',
    title: 'Online Shopping Recommendation System',
    summary: 'An AI-powered recommendation project exploring personalized product discovery using Python, LLMs, and recommendation techniques.',
    overview: 'The project applies recommendation concepts and language-model capabilities to support more relevant shopping suggestions. It demonstrates applied AI beyond a conversational interface.',
    contribution: ['Developed the recommendation workflow using Python.', 'Explored the use of LLMs alongside recommendation techniques.', 'Focused on AI-assisted product discovery and personalization.'],
    stack: ['Python', 'LLMs', 'Recommendation Systems']
  },
  'amr': {
    kicker: 'ROBOTICS · AUTONOMOUS SYSTEMS',
    title: 'Autonomous Mobile Robot',
    summary: 'An autonomous mobile robotics project using ROS, navigation concepts, and sensor integration.',
    overview: 'The project brings together robotics software and hardware-facing concepts to support autonomous movement and navigation.',
    contribution: ['Worked with ROS for the robotics software stack.', 'Applied navigation concepts for autonomous movement.', 'Worked with sensor integration as part of the system.'],
    stack: ['ROS', 'Robotics', 'Navigation', 'Sensor Integration']
  },
  'movie-library': {
    kicker: 'FULL-STACK DEVELOPMENT',
    title: 'Movie Library Application',
    summary: 'A full-stack movie library application with search and movie management functionality, built using Next.js, React, TypeScript, and JSON storage.',
    overview: 'The application provides a web interface for browsing and managing a movie collection. It uses a JSON-based data layer rather than a separate database service.',
    contribution: ['Built the application with Next.js and React.', 'Implemented movie search and management functionality.', 'Used TypeScript and JSON for application data handling.'],
    stack: ['Next.js', 'React', 'TypeScript', 'JSON']
  }
};

const projectModal = document.getElementById('project-modal');
const resumeModal = document.getElementById('resume-modal');
let previousFocus = null;
function openModal(modal) {
  previousFocus = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-dialog')?.focus();
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.detail-modal.open')) document.body.style.overflow = '';
  previousFocus?.focus?.();
}
function showProject(key) {
  const project = projects[key];
  if (!project) return;
  document.getElementById('modal-kicker').textContent = project.kicker;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-summary').textContent = project.summary;
  document.getElementById('modal-overview').textContent = project.overview;
  const list = document.getElementById('modal-contribution');
  list.replaceChildren(...project.contribution.map(item => {
    const li = document.createElement('li'); li.textContent = item; return li;
  }));
  const tags = document.getElementById('modal-tags');
  tags.replaceChildren(...project.stack.map(item => {
    const span = document.createElement('span'); span.textContent = item; return span;
  }));
  openModal(projectModal);
}
document.querySelectorAll('[data-project]').forEach(card => {
  card.addEventListener('click', () => showProject(card.dataset.project));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showProject(card.dataset.project); }
  });
});

document.getElementById('open-resume')?.addEventListener('click', () => openModal(resumeModal));
document.getElementById('resume-card')?.addEventListener('click', () => openModal(resumeModal));
document.querySelectorAll('[data-close-modal]').forEach(button => {
  button.addEventListener('click', () => closeModal(button.closest('.detail-modal')));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.detail-modal.open').forEach(closeModal);
});

document.getElementById('year').textContent = new Date().getFullYear();
