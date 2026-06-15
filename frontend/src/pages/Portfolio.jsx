import React, { useState, useEffect } from 'react'
import API from '../utils/api.js'
import './Portfolio.css'

const TABS = ['About', 'Resume', 'Portfolio', 'Contact']

const CATEGORY_COLORS = {
  fullstack: '#4ade80',
  backend: '#60a5fa',
  frontend: '#f472b6',
  ai: '#a78bfa',
  other: '#fb923c',
}

const CATEGORY_LABELS = {
  fullstack: 'Full Stack',
  backend: 'Backend',
  frontend: 'Frontend',
  ai: 'AI / ML',
  other: 'Other',
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ profile }) {
  const [open, setOpen] = useState(false)
  if (!profile) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-info">
        <figure className="avatar-box">
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.name} />
            : <div className="avatar-placeholder">{profile.name?.[0] || 'G'}</div>
          }
        </figure>
        <div className="info-content">
          <h1 className="name">{profile.name}</h1>
          <p className="title-badge">{profile.title}</p>
        </div>
        <button className="info-toggle" onClick={() => setOpen(!open)}>
          {open ? 'Hide Contacts' : 'Show Contacts'}
          <span className={`chevron ${open ? 'up' : ''}`}>▾</span>
        </button>
      </div>

      <div className={`sidebar-extra ${open ? 'visible' : ''}`}>
        <div className="separator" />
        <ul className="contacts-list">
          {profile.email && (
            <li className="contact-item">
              <div className="icon-box"><ion-icon name="mail-outline" /></div>
              <div className="contact-info">
                <p className="contact-label">Email</p>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </li>
          )}
          {profile.phone && (
            <li className="contact-item">
              <div className="icon-box"><ion-icon name="phone-portrait-outline" /></div>
              <div className="contact-info">
                <p className="contact-label">Phone</p>
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              </div>
            </li>
          )}
          {profile.birthday && (
            <li className="contact-item">
              <div className="icon-box"><ion-icon name="calendar-outline" /></div>
              <div className="contact-info">
                <p className="contact-label">Birthday</p>
                <time>{new Date(profile.birthday).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              </div>
            </li>
          )}
          {profile.location && (
            <li className="contact-item">
              <div className="icon-box"><ion-icon name="location-outline" /></div>
              <div className="contact-info">
                <p className="contact-label">Location</p>
                <address>{profile.location}</address>
              </div>
            </li>
          )}
        </ul>

        <div className="separator" />

        <ul className="social-list">
          {profile.linkedin && (
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="social-link" title="LinkedIn">
                <ion-icon name="logo-linkedin" />
              </a>
            </li>
          )}
          {profile.github && (
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="social-link" title="GitHub">
                <ion-icon name="logo-github" />
              </a>
            </li>
          )}
          {profile.leetcode && (
            <li>
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="social-link leetcode-link" title="LeetCode">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
              </a>
            </li>
          )}
        </ul>

        {profile.resumeUrl && (
          <>
            <div className="separator" />
            <a
              href={profile.resumeUrl}
              download="Gopal_Kute_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="resume-download-btn"
            >
              <ion-icon name="download-outline" />
              Download Resume
            </a>
          </>
        )}
      </div>
    </aside>
  )
}

// ─── About Tab ────────────────────────────────────────────────────────────────
function AboutTab({ profile }) {
  if (!profile) return null
  return (
    <article className="tab-content">
      <header><h2 className="article-title">About me</h2></header>

      <section className="about-text">
        {(profile.about || []).map((p, i) => <p key={i}>{p}</p>)}
      </section>

      {profile.services?.length > 0 && (
        <section className="service-section">
          <h3 className="section-title">What I'm doing</h3>
          <ul className="service-list">
            {profile.services.map((s, i) => (
              <li key={i} className="service-item card">
                <div className="service-icon">
                  <ion-icon name={s.icon || 'code-slash-outline'} />
                </div>
                <div>
                  <h4 className="service-title-item">{s.title}</h4>
                  <p className="service-desc">{s.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.achievements?.length > 0 && (
        <section className="achievements-section">
          <h3 className="section-title">Key Achievements</h3>
          <ul className="achievements-list">
            {profile.achievements.map((a, i) => (
              <li key={i} className="achievement-item">
                <ion-icon name="trophy-outline" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

// ─── Resume Tab ───────────────────────────────────────────────────────────────
function ResumeTab({ experience, education, skills, profile }) {
  const skillsByCategory = (skills || []).reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <article className="tab-content">
      <header className="resume-header">
        <h2 className="article-title">Resume</h2>
        {profile?.resumeUrl && (
          <a
            href={profile.resumeUrl}
            download="Gopal_Kute_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn-primary resume-dl-btn"
          >
            <ion-icon name="download-outline" />
            Download CV
          </a>
        )}
      </header>

      <section className="resume-section">
        <h3 className="section-title">
          <ion-icon name="briefcase-outline" /> Experience
        </h3>
        <div className="timeline">
          {(experience || []).map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <h4 className="timeline-role">{exp.role}</h4>
                <p className="timeline-company">{exp.company}</p>
                <time className="timeline-period">{exp.period}</time>
                <p className="timeline-desc">{exp.description}</p>
                <div className="tech-tags">
                  {(exp.technologies || []).map((t, j) => <span key={j} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3 className="section-title">
          <ion-icon name="school-outline" /> Education
        </h3>
        <div className="timeline">
          {(education || []).map((edu, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content card">
                <h4 className="timeline-role">{edu.degree}</h4>
                <p className="timeline-company">{edu.institution}</p>
                <time className="timeline-period">{edu.period}</time>
                {edu.grade && <p className="timeline-grade">Grade: <strong>{edu.grade}</strong></p>}
                {edu.status && <span className="status-badge">{edu.status}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3 className="section-title">
          <ion-icon name="code-working-outline" /> Skills
        </h3>
        <div className="skills-grid">
          {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
            <div key={cat} className="skill-category card">
              <h4 className="skill-cat-title">{cat}</h4>
              <div className="skill-items">
                {catSkills.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-header">
                      <span>{skill.name}</span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}

// ─── Portfolio Tab ────────────────────────────────────────────────────────────
function PortfolioTab({ projects }) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const categories = ['all', ...new Set((projects || []).map(p => p.category))]
  const filtered = filter === 'all' ? projects : (projects || []).filter(p => p.category === filter)

  return (
    <article className="tab-content">
      <header><h2 className="article-title">Portfolio</h2></header>

      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {(filtered || []).map((project, i) => (
          <div key={i} className="project-card card" onClick={() => setSelected(project)}>
            <div className="project-img-box">
              {project.image
                ? <img src={project.image} alt={project.title} />
                : <div className="project-placeholder"><ion-icon name="code-slash-outline" /></div>
              }
              <span className="project-cat-badge" style={{ background: CATEGORY_COLORS[project.category] }}>
                {CATEGORY_LABELS[project.category] || project.category}
              </span>
            </div>
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {(project.technologies || []).slice(0, 4).map((t, j) => <span key={j} className="tag">{t}</span>)}
                {project.technologies?.length > 4 && <span className="tag">+{project.technologies.length - 4}</span>}
              </div>
              {project.guideUrl && (
                <div className="project-guide-badge">
                  <ion-icon name="play-circle-outline" />
                  {project.guideLabel || 'Case Study'} available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <ion-icon name="close-outline" />
            </button>
            <h2 className="modal-title">{selected.title}</h2>
            <span className="project-cat-badge inline" style={{ background: CATEGORY_COLORS[selected.category] }}>
              {CATEGORY_LABELS[selected.category] || selected.category}
            </span>
            <p className="modal-long-desc">{selected.longDescription || selected.description}</p>
            {selected.highlights?.length > 0 && (
              <>
                <h4 className="modal-sub">Key Features</h4>
                <ul className="modal-highlights">
                  {selected.highlights.map((h, i) => (
                    <li key={i}><ion-icon name="checkmark-circle-outline" />{h}</li>
                  ))}
                </ul>
              </>
            )}
            <h4 className="modal-sub">Technologies</h4>
            <div className="project-tech">
              {selected.technologies?.map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
            <div className="modal-links">
              {selected.github && (
                <a href={selected.github} target="_blank" rel="noreferrer" className="modal-btn modal-btn-github">
                  <ion-icon name="logo-github" /> GitHub
                </a>
              )}
              {selected.live && (
                <a href={selected.live} target="_blank" rel="noreferrer" className="modal-btn modal-btn-live">
                  <ion-icon name="open-outline" /> Live Demo
                </a>
              )}
              {selected.guideUrl && (
                <a href={selected.guideUrl} target="_blank" rel="noreferrer" className="modal-btn modal-btn-guide">
                  <ion-icon name="play-circle-outline" /> {selected.guideLabel || 'Case Study'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await API.post('/messages', form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  return (
    <article className="tab-content">
      <header><h2 className="article-title">Contact</h2></header>

      <div className="contact-grid">
        <div className="contact-info-panel">
          <h3 className="section-title">Get In Touch</h3>
          <p className="contact-intro">
            I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hello — my inbox is open!
          </p>
          <ul className="contact-details">
            {profile?.email && (
              <li><ion-icon name="mail-outline" /><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            )}
            {profile?.phone && (
              <li><ion-icon name="call-outline" /><a href={`tel:${profile.phone}`}>{profile.phone}</a></li>
            )}
            {profile?.location && (
              <li><ion-icon name="location-outline" /><span>{profile.location}</span></li>
            )}
            {profile?.linkedin && (
              <li><ion-icon name="logo-linkedin" /><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn Profile</a></li>
            )}
            {profile?.github && (
              <li><ion-icon name="logo-github" /><a href={profile.github} target="_blank" rel="noreferrer">GitHub Profile</a></li>
            )}
            {profile?.leetcode && (
              <li>
                <span className="contact-lc-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                  </svg>
                </span>
                <a href={profile.leetcode} target="_blank" rel="noreferrer">LeetCode Profile</a>
              </li>
            )}
          </ul>
        </div>

        <div className="contact-form-panel">
          <h3 className="section-title">Send Message</h3>
          {status === 'success' && (
            <div className="alert alert-success">
              <ion-icon name="checkmark-circle-outline" /> Message sent! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="alert alert-error">
              <ion-icon name="alert-circle-outline" /> Failed to send. Please try again.
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="How can I help?"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                placeholder="Your message..."
                rows={5}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending
                ? 'Sending...'
                : <><ion-icon name="send-outline" /> Send Message</>
              }
            </button>
          </form>
        </div>
      </div>
    </article>
  )
}

// ─── Main Portfolio ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('About')
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      API.get('/profile'),
      API.get('/projects'),
      API.get('/skills'),
      API.get('/experience'),
      API.get('/education'),
    ]).then(([p, pr, sk, ex, ed]) => {
      setProfile(p.data)
      setProjects(pr.data)
      setSkills(sk.data)
      setExperience(ex.data)
      setEducation(ed.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
    </div>
  )

  return (
    <div className="portfolio-layout">
      <Sidebar profile={profile} />

      <div className="main-content">
        <nav className="navbar">
          <ul className="navbar-list">
            {TABS.map(tab => (
              <li key={tab} className="navbar-item">
                <button
                  className={`navbar-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="tab-panels">
          {activeTab === 'About'     && <AboutTab profile={profile} />}
          {activeTab === 'Resume'    && <ResumeTab experience={experience} education={education} skills={skills} profile={profile} />}
          {activeTab === 'Portfolio' && <PortfolioTab projects={projects} />}
          {activeTab === 'Contact'   && <ContactTab profile={profile} />}
        </div>
      </div>
    </div>
  )
}
