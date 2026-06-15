import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../utils/api.js";
import "./AdminDashboard.css";

const SECTIONS = [
  "Overview",
  "Profile",
  "Projects",
  "Skills",
  "Experience",
  "Education",
  "Messages",
];

function sectionIcon(s) {
  const map = {
    Overview: "grid-outline",
    Profile: "person-outline",
    Projects: "folder-outline",
    Skills: "code-slash-outline",
    Experience: "briefcase-outline",
    Education: "school-outline",
    Messages: "mail-outline",
  };
  return map[s] || "ellipse-outline";
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

// ─── Available Ionicons for services ─────────────────────────────────────────
const SERVICE_ICONS = [
  "code-slash-outline",
  "layers-outline",
  "git-branch-outline",
  "shield-checkmark-outline",
  "server-outline",
  "cloud-outline",
  "terminal-outline",
  "construct-outline",
  "bulb-outline",
  "rocket-outline",
  "globe-outline",
  "settings-outline",
  "phone-portrait-outline",
  "desktop-outline",
  "analytics-outline",
  "lock-closed-outline",
  "people-outline",
  "briefcase-outline",
  "school-outline",
  "ribbon-outline",
];

// ─── Overview ─────────────────────────────────────────────────────────────────
function Overview({ stats }) {
  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Dashboard Overview</h2>
      <div className="stats-grid">
        {[
          {
            label: "Projects",
            value: stats.projects,
            icon: "folder-outline",
            color: "#60a5fa",
          },
          {
            label: "Skills",
            value: stats.skills,
            icon: "code-slash-outline",
            color: "#4ade80",
          },
          {
            label: "Experience",
            value: stats.experience,
            icon: "briefcase-outline",
            color: "#f472b6",
          },
          {
            label: "Messages",
            value: stats.messages,
            icon: "mail-outline",
            color: "#fb923c",
          },
          {
            label: "Unread",
            value: stats.unread,
            icon: "notifications-outline",
            color: "#a78bfa",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ color: s.color }}>
              <ion-icon name={s.icon} />
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="quick-links">
        <p className="ql-hint">Quick navigation</p>
        <div className="ql-grid">
          <a href="/" target="_blank" rel="noreferrer" className="ql-item">
            <ion-icon name="eye-outline" /> View Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Resume Uploader ──────────────────────────────────────────────────────────
function ResumeUploader({ currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10MB)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await API.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url);
      toast.success(
        "Resume uploaded as Gopal_Kute_Resume.pdf! Old file deleted from server. Click Save Changes to apply.",
      );
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="resume-uploader">
      <label
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="upload-state">
            <div className="spinner small" />
            <span>Uploading…</span>
          </div>
        ) : (
          <div className="upload-state">
            <ion-icon name="cloud-upload-outline" />
            <span>
              Drag & drop PDF here, or <strong>click to browse</strong>
            </span>
            <small>
              Max 10MB · PDF only · Old resume auto-deleted from server
            </small>
          </div>
        )}
      </label>
      {currentUrl && (
        <div className="current-resume">
          <ion-icon name="document-outline" />
          <a href={currentUrl} target="_blank" rel="noreferrer">
            View current resume
          </a>
          <span className="resume-ok">✓ Active</span>
        </div>
      )}
    </div>
  );
}

// ─── Image Uploader (for projects) ───────────────────────────────────────────
function ImageUploader({ currentUrl, projectId, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, GIF allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (projectId) formData.append("projectId", projectId);
      const res = await API.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="resume-uploader">
      <label
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="upload-state">
            <div className="spinner small" />
            <span>Uploading…</span>
          </div>
        ) : (
          <div className="upload-state">
            <ion-icon name="image-outline" />
            <span>
              Drag & drop image here, or <strong>click to browse</strong>
            </span>
            <small>Max 5MB · JPG, PNG, WEBP, GIF · Or paste a URL below</small>
          </div>
        )}
      </label>
      {currentUrl && (
        <div className="image-preview">
          <img src={currentUrl} alt="Project preview" />
          <span className="resume-ok">✓ Image set</span>
        </div>
      )}
    </div>
  );
}

// ─── Avatar Uploader ──────────────────────────────────────────────────────────
function AvatarUploader({ currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await API.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded(res.data.url);
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="avatar-uploader-wrap">
      {/* Current photo preview */}
      <div className="avatar-preview-box">
        {currentUrl ? (
          <img src={currentUrl} alt="Profile" className="avatar-preview-img" />
        ) : (
          <div className="avatar-preview-placeholder">
            <ion-icon name="person-outline" />
          </div>
        )}
      </div>

      {/* Upload zone */}
      <label
        className={`avatar-drop-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {uploading ? (
          <div className="upload-state">
            <div className="spinner small" />
            <span>Uploading…</span>
          </div>
        ) : (
          <div className="upload-state">
            <ion-icon name="cloud-upload-outline" />
            <span>
              <strong>Click to upload</strong> or drag & drop
            </span>
            <small>JPG, PNG, WEBP · Max 5MB · Auto face-crop to square</small>
          </div>
        )}
      </label>
    </div>
  );
}

// ─── Profile Editor ───────────────────────────────────────────────────────────
function ProfileEditor() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("/profile")
      .then((r) => setProfile(r.data || {}))
      .catch(() => setProfile({}));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await API.put("/profile", profile);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  const upd = (f, v) => setProfile((p) => ({ ...p, [f]: v }));
  const updArr = (f, v) =>
    setProfile((p) => ({ ...p, [f]: v.split("\n").filter(Boolean) }));
  const updSvc = (i, k, v) => {
    const svc = [...(profile.services || [])];
    svc[i] = { ...svc[i], [k]: v };
    setProfile((p) => ({ ...p, services: svc }));
  };
  const addSvc = () =>
    setProfile((p) => ({
      ...p,
      services: [
        ...(p.services || []),
        { title: "", description: "", icon: "code-slash-outline" },
      ],
    }));
  const delSvc = (i) =>
    setProfile((p) => ({
      ...p,
      services: p.services.filter((_, idx) => idx !== i),
    }));

  if (!profile)
    return (
      <div className="loading-inner">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="admin-section-title">Edit Profile</h2>
        <button className="btn-save" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="form-grid">
        <FormField
          label="Full Name"
          value={profile.name || ""}
          onChange={(v) => upd("name", v)}
        />
        <FormField
          label="Title"
          value={profile.title || ""}
          onChange={(v) => upd("title", v)}
        />
        <FormField
          label="Subtitle"
          value={profile.subtitle || ""}
          onChange={(v) => upd("subtitle", v)}
        />
        <FormField
          label="Email"
          value={profile.email || ""}
          onChange={(v) => upd("email", v)}
        />
        <FormField
          label="Phone"
          value={profile.phone || ""}
          onChange={(v) => upd("phone", v)}
        />
        <FormField
          label="Location"
          value={profile.location || ""}
          onChange={(v) => upd("location", v)}
        />
        <FormField
          label="Birthday (YYYY-MM-DD)"
          value={profile.birthday || ""}
          onChange={(v) => upd("birthday", v)}
        />
        <FormField
          label="CGPA"
          value={profile.cgpa || ""}
          onChange={(v) => upd("cgpa", v)}
        />
        <FormField
          label="LinkedIn URL"
          value={profile.linkedin || ""}
          onChange={(v) => upd("linkedin", v)}
        />
        <FormField
          label="GitHub URL"
          value={profile.github || ""}
          onChange={(v) => upd("github", v)}
        />
        <FormField
          label="LeetCode URL"
          value={profile.leetcode || ""}
          onChange={(v) => upd("leetcode", v)}
        />
        <FormField
          label="Resume URL (auto-filled on upload)"
          value={profile.resumeUrl || ""}
          onChange={(v) => upd("resumeUrl", v)}
        />
      </div>

      {/* ── Avatar Upload ── */}
      <div className="resume-upload-section">
        <h3>🖼️ Profile Photo</h3>
        <p className="upload-hint">
          Upload your profile photo. Stored permanently on Cloudinary — old
          photo auto-deleted when replaced.
        </p>
        <AvatarUploader
          currentUrl={profile.avatar}
          onUploaded={(url) => {
            upd("avatar", url);
            toast.success("Photo uploaded! Click Save Changes to apply.");
          }}
        />
      </div>

      <div className="resume-upload-section">
        <h3>📄 Upload Resume PDF</h3>
        <p className="upload-hint">
          Uploading a new PDF automatically deletes the previous one from the
          server — no wasted space. The Download Resume button on your portfolio
          appears as soon as a resume is set.
        </p>
        <ResumeUploader
          currentUrl={profile.resumeUrl}
          onUploaded={(url) => upd("resumeUrl", url)}
        />
      </div>

      <div className="form-group full-width mb16">
        <label>About Paragraphs (one per line)</label>
        <textarea
          rows={6}
          value={(profile.about || []).join("\n")}
          onChange={(e) => updArr("about", e.target.value)}
        />
      </div>

      <div className="form-group full-width mb16">
        <label>Achievements (one per line)</label>
        <textarea
          rows={4}
          value={(profile.achievements || []).join("\n")}
          onChange={(e) => updArr("achievements", e.target.value)}
        />
      </div>

      {/* ── Services ── */}
      <div className="subsection">
        <div className="subsection-header">
          <h3>Services / What I'm Doing</h3>
          <button className="btn-add" onClick={addSvc}>
            + Add Service
          </button>
        </div>
        <p className="field-hint">
          Each service shows an icon, title, and description on the About tab.
          Choose an icon from the picker below.
        </p>

        {(profile.services || []).map((s, i) => (
          <div key={i} className="service-edit-card">
            <div className="service-edit-header">
              {/* Icon preview */}
              <div className="svc-icon-preview">
                <ion-icon name={s.icon || "code-slash-outline"} />
              </div>
              <div className="svc-edit-fields">
                <FormField
                  label="Service Title"
                  value={s.title || ""}
                  onChange={(v) => updSvc(i, "title", v)}
                />
                <FormField
                  label="Description"
                  value={s.description || ""}
                  onChange={(v) => updSvc(i, "description", v)}
                />
              </div>
              <button
                className="btn-delete svc-del-btn"
                onClick={() => delSvc(i)}
              >
                Delete
              </button>
            </div>
            {/* Icon picker */}
            <div className="icon-picker-section">
              <p className="icon-picker-label">Choose Icon</p>
              <div className="icon-picker-grid">
                {SERVICE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    className={`icon-option ${s.icon === icon ? "selected" : ""}`}
                    onClick={() => updSvc(i, "icon", icon)}
                    title={icon.replace(/-outline$/, "").replace(/-/g, " ")}
                  >
                    <ion-icon name={icon} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Projects Manager ─────────────────────────────────────────────────────────
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(
    () => API.get("/projects").then((r) => setProjects(r.data)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  const blank = {
    title: "",
    category: "backend",
    description: "",
    longDescription: "",
    technologies: [],
    github: "",
    live: "",
    guideUrl: "",
    guideLabel: "Case Study",
    featured: false,
    order: 0,
    highlights: [],
    image: "",
  };

  const save = async (p) => {
    try {
      if (p._id) await API.put(`/projects/${p._id}`, p);
      else await API.post("/projects", p);
      toast.success("Project saved!");
      load();
      setEditing(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  if (editing !== null)
    return (
      <ProjectForm
        initial={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="admin-section-title">Projects ({projects.length})</h2>
        <button className="btn-save" onClick={() => setEditing(blank)}>
          + Add Project
        </button>
      </div>
      <div className="items-list">
        {projects.map((p) => (
          <div key={p._id} className="list-item-card">
            <div className="item-info">
              <h4>{p.title}</h4>
              <p className="item-sub">
                {p.category}
                {p.featured ? " · ⭐ Featured" : ""}
              </p>
              <div className="tech-tags small">
                {(p.technologies || []).slice(0, 5).map((t, i) => (
                  <span key={i} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => setEditing(p)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => del(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...initial,
    technologies: Array.isArray(initial.technologies)
      ? initial.technologies.join(", ")
      : initial.technologies || "",
    highlights: Array.isArray(initial.highlights)
      ? initial.highlights.join("\n")
      : initial.highlights || "",
  });

  const handleSave = () =>
    onSave({
      ...form,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      highlights: form.highlights.split("\n").filter(Boolean),
    });

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="admin-section-title">
          {form._id ? "Edit" : "New"} Project
        </h2>
        <div className="btn-row">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      <div className="form-grid">
        <FormField
          label="Title"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
        />
        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            {["fullstack", "backend", "frontend", "ai", "other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <FormField
          label="GitHub URL"
          value={form.github || ""}
          onChange={(v) => setForm((f) => ({ ...f, github: v }))}
        />
        <FormField
          label="Live Demo URL"
          value={form.live || ""}
          onChange={(v) => setForm((f) => ({ ...f, live: v }))}
        />
        <FormField
          label="Case Study URL (video/PDF — optional)"
          value={form.guideUrl || ""}
          onChange={(v) => setForm((f) => ({ ...f, guideUrl: v }))}
          placeholder="https://loom.com/... or drive.google.com/..."
        />
        <div className="form-group">
          <label>Case Study Button Label</label>
          <select
            value={form.guideLabel || "Case Study"}
            onChange={(e) =>
              setForm((f) => ({ ...f, guideLabel: e.target.value }))
            }
          >
            <option value="Case Study">Case Study</option>
            <option value="Watch Demo">Watch Demo</option>
            <option value="Video Walkthrough">Video Walkthrough</option>
            <option value="Project Guide">Project Guide</option>
            <option value="View PDF">View PDF</option>
            <option value="Architecture Doc">Architecture Doc</option>
          </select>
        </div>
        <FormField
          label="Order (display sequence)"
          value={String(form.order || 0)}
          type="number"
          onChange={(v) => setForm((f) => ({ ...f, order: Number(v) }))}
        />
      </div>

      {/* Featured explanation */}
      <div className="featured-toggle-row">
        <label className="featured-label">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, featured: e.target.checked }))
            }
          />
          <span className="featured-text">
            <strong>⭐ Featured Project</strong>
            <span className="featured-hint">
              Featured projects appear first and are highlighted on the
              portfolio page. Use this for your best 2–3 projects.
            </span>
          </span>
        </label>
      </div>

      {/* Project image — upload OR URL */}
      <div className="resume-upload-section">
        <h3>🖼️ Project Image</h3>
        <p className="upload-hint">
          Upload an image <strong>or</strong> paste a URL below. The uploaded
          image is stored on the server and displayed on the portfolio project
          card.
        </p>
        <ImageUploader
          currentUrl={form.image}
          projectId={form._id}
          onUploaded={(url) => setForm((f) => ({ ...f, image: url }))}
        />
        <div className="form-group" style={{ marginTop: 10 }}>
          <label>Or paste image URL directly</label>
          <input
            type="text"
            value={form.image || ""}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="https://... or /assets/images/project-1.jpg"
          />
        </div>
      </div>

      <div className="form-group full-width mb16">
        <label>Short Description (shown on project card)</label>
        <textarea
          rows={2}
          value={form.description || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
      </div>
      <div className="form-group full-width mb16">
        <label>Long Description (shown in project modal popup)</label>
        <textarea
          rows={4}
          value={form.longDescription || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, longDescription: e.target.value }))
          }
        />
      </div>
      <div className="form-group full-width mb16">
        <label>Technologies (comma separated)</label>
        <input
          type="text"
          value={form.technologies}
          onChange={(e) =>
            setForm((f) => ({ ...f, technologies: e.target.value }))
          }
          placeholder="React.js, Node.js, MongoDB…"
        />
      </div>
      <div className="form-group full-width">
        <label>
          Key Highlights (one per line — shown as checklist in modal)
        </label>
        <textarea
          rows={4}
          value={form.highlights}
          onChange={(e) =>
            setForm((f) => ({ ...f, highlights: e.target.value }))
          }
          placeholder="AES-256 encryption&#10;JWT authentication&#10;REST API"
        />
      </div>
    </div>
  );
}

// ─── Skills Manager ───────────────────────────────────────────────────────────
function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    category: "Backend",
    name: "",
    level: 75,
  });
  const load = useCallback(
    () => API.get("/skills").then((r) => setSkills(r.data)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!newSkill.name.trim()) {
      toast.error("Enter a skill name");
      return;
    }
    try {
      await API.post("/skills", newSkill);
      toast.success("Added");
      load();
      setNewSkill((s) => ({ ...s, name: "" }));
    } catch {
      toast.error("Failed");
    }
  };

  const update = async (skill) => {
    try {
      await API.put(`/skills/${skill._id}`, skill);
      toast.success("Updated");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete skill?")) return;
    try {
      await API.delete(`/skills/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  const byCategory = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Skills</h2>
      <div className="add-form">
        <h3>Add New Skill</h3>
        <div className="form-grid compact">
          <FormField
            label="Category"
            value={newSkill.category}
            onChange={(v) => setNewSkill((s) => ({ ...s, category: v }))}
          />
          <FormField
            label="Skill Name"
            value={newSkill.name}
            onChange={(v) => setNewSkill((s) => ({ ...s, name: v }))}
          />
          <FormField
            label="Level 0–100"
            value={String(newSkill.level)}
            onChange={(v) => setNewSkill((s) => ({ ...s, level: Number(v) }))}
            type="number"
          />
        </div>
        <button className="btn-save" onClick={add}>
          Add Skill
        </button>
      </div>
      {Object.entries(byCategory).map(([cat, catSkills]) => (
        <div key={cat} className="skill-group">
          <h3 className="skill-group-title">{cat}</h3>
          {catSkills.map((skill) => (
            <SkillRow
              key={skill._id}
              skill={skill}
              onUpdate={update}
              onDelete={() => del(skill._id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkillRow({ skill, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(skill);

  return editing ? (
    <div className="list-item-card" style={{ marginBottom: 8 }}>
      <div className="item-info" style={{ width: "100%" }}>
        <div className="form-grid compact">
          <FormField
            label="Name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <FormField
            label="Level"
            value={String(form.level)}
            onChange={(v) => setForm((f) => ({ ...f, level: Number(v) }))}
            type="number"
          />
        </div>
      </div>
      <div className="item-actions">
        <button
          className="btn-save small"
          onClick={() => {
            onUpdate(form);
            setEditing(false);
          }}
        >
          Save
        </button>
        <button className="btn-cancel small" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="list-item-card compact-row" style={{ marginBottom: 6 }}>
      <span className="skill-name">{skill.name}</span>
      <div className="mini-bar">
        <div className="mini-fill" style={{ width: `${skill.level}%` }} />
      </div>
      <span className="skill-lvl">{skill.level}%</span>
      <div className="item-actions">
        <button className="btn-edit small" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn-delete small" onClick={onDelete}>
          ×
        </button>
      </div>
    </div>
  );
}

// ─── Generic CRUD Manager ─────────────────────────────────────────────────────
function CrudManager({ title, endpoint, fields, renderSummary, blank }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(
    () => API.get(endpoint).then((r) => setItems(r.data)),
    [endpoint],
  );
  useEffect(() => {
    load();
  }, [load]);

  const save = async (item) => {
    try {
      if (item._id) await API.put(`${endpoint}/${item._id}`, item);
      else await API.post(endpoint, item);
      toast.success("Saved!");
      load();
      setEditing(null);
    } catch {
      toast.error("Failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await API.delete(`${endpoint}/${id}`);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  if (editing !== null)
    return (
      <GenericForm
        title={title}
        form={editing}
        fields={fields}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="admin-section-title">
          {title} ({items.length})
        </h2>
        <button className="btn-save" onClick={() => setEditing(blank)}>
          + Add
        </button>
      </div>
      <div className="items-list">
        {items.map((item) => (
          <div key={item._id} className="list-item-card">
            <div className="item-info">{renderSummary(item)}</div>
            <div className="item-actions">
              <button className="btn-edit" onClick={() => setEditing(item)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => del(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericForm({ title, form: initialForm, fields, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const handleSave = () => {
    const data = { ...form };
    fields.forEach((f) => {
      if (f.csvField && typeof form[f.key] === "string")
        data[f.key] = form[f.key]
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    });
    onSave(data);
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="admin-section-title">
          {form._id ? "Edit" : "New"} {title}
        </h2>
        <div className="btn-row">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <div className="form-grid">
        {fields.map((f) => {
          const raw = form[f.key];
          const val = Array.isArray(raw)
            ? raw.join(f.csvField ? ", " : "\n")
            : (raw ?? "");
          return f.multiline ? (
            <div key={f.key} className="form-group full-width">
              <label>{f.label}</label>
              <textarea
                rows={4}
                value={val}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [f.key]: e.target.value }))
                }
              />
            </div>
          ) : (
            <FormField
              key={f.key}
              label={f.label}
              value={String(val)}
              type={f.type}
              onChange={(v) =>
                setForm((p) => ({
                  ...p,
                  [f.key]: f.type === "number" ? Number(v) : v,
                }))
              }
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Messages Manager ─────────────────────────────────────────────────────────
function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const load = useCallback(
    () => API.get("/messages").then((r) => setMessages(r.data)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    try {
      await API.patch(`/messages/${id}/read`);
      load();
    } catch {}
  };

  const del = async (id) => {
    if (!window.confirm("Delete message?")) return;
    try {
      await API.delete(`/messages/${id}`);
      toast.success("Deleted");
      load();
      setSelected(null);
    } catch {
      toast.error("Failed");
    }
  };

  // Build mailto: link with subject and body pre-filled
  const buildReplyLink = (msg) => {
    const subject = encodeURIComponent(`Re: ${msg.subject || "Your message"}`);
    const body = encodeURIComponent(
      `Hi ${msg.name},\n\nThank you for reaching out.\n\n---\nYour original message:\n${msg.message}`,
    );
    return `mailto:${msg.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="admin-section">
      <h2 className="admin-section-title">Messages ({messages.length})</h2>
      <div className="messages-layout">
        <div className="messages-list">
          {messages.length === 0 && <p className="empty">No messages yet.</p>}
          {messages.map((m) => (
            <div
              key={m._id}
              className={`msg-item ${!m.read ? "unread" : ""} ${selected?._id === m._id ? "active" : ""}`}
              onClick={() => {
                setSelected(m);
                if (!m.read) markRead(m._id);
              }}
            >
              <div className="msg-sender">
                {m.name}
                {!m.read && <span className="unread-dot" />}
              </div>
              <div className="msg-subject">{m.subject || "(no subject)"}</div>
              <div className="msg-date">
                {new Date(m.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <div className="message-detail">
          {selected ? (
            <>
              <div className="msg-detail-header">
                <div>
                  <h3>{selected.subject || "(no subject)"}</h3>
                  <p className="msg-meta">
                    From: <strong>{selected.name}</strong>
                  </p>
                  <p className="msg-meta">
                    Email:{" "}
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </p>
                  <p className="msg-meta">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="btn-delete"
                  onClick={() => del(selected._id)}
                >
                  Delete
                </button>
              </div>
              <div className="msg-body">{selected.message}</div>
              <div className="reply-actions">
                {/* Primary: mailto link — opens default mail app */}
                <a
                  href={buildReplyLink(selected)}
                  className="reply-btn-primary"
                >
                  <ion-icon name="mail-outline" /> Reply via Email App
                </a>
                {/* Secondary: copy email */}
                <button
                  className="reply-btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(selected.email);
                    toast.success("Email copied!");
                  }}
                >
                  <ion-icon name="copy-outline" /> Copy Email
                </button>
              </div>
              <p className="reply-note">
                💡 "Reply via Email App" opens your default mail client (Gmail,
                Outlook, etc.) with the reply pre-filled. If it doesn't open,
                use "Copy Email" and paste into your email app manually.
              </p>
            </>
          ) : (
            <p className="empty">Select a message to read</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    messages: 0,
    unread: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get("/projects"),
      API.get("/skills"),
      API.get("/experience"),
      API.get("/messages"),
    ])
      .then(([pr, sk, ex, ms]) => {
        setStats({
          projects: pr.data.length,
          skills: sk.data.length,
          experience: ex.data.length,
          messages: ms.data.length,
          unread: ms.data.filter((m) => !m.read).length,
        });
      })
      .catch(() => {});
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  const handleNavClick = (section) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  const expFields = [
    { label: "Company", key: "company" },
    { label: "Role", key: "role" },
    { label: "Period", key: "period" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
    { label: "Order", key: "order", type: "number" },
    {
      label: "Technologies (comma separated)",
      key: "technologies",
      csvField: true,
    },
    { label: "Description", key: "description", multiline: true },
  ];
  const expBlank = {
    company: "",
    role: "",
    period: "",
    startDate: "",
    description: "",
    technologies: [],
    order: 0,
  };

  const eduFields = [
    { label: "Institution", key: "institution" },
    { label: "Degree", key: "degree" },
    { label: "Period", key: "period" },
    { label: "Grade", key: "grade" },
    { label: "Status", key: "status" },
    { label: "Order", key: "order", type: "number" },
  ];
  const eduBlank = {
    institution: "",
    degree: "",
    period: "",
    grade: "",
    status: "",
    order: 0,
  };

  return (
    <div className="admin-layout">
      {mobileOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "" : "collapsed"} ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <ion-icon name="terminal-outline" />
            <span>Admin Panel</span>
          </div>
          <button
            className="toggle-sidebar"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <ion-icon
              name={
                sidebarOpen ? "chevron-back-outline" : "chevron-forward-outline"
              }
            />
          </button>
        </div>

        <nav className="admin-nav">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`admin-nav-btn ${activeSection === s ? "active" : ""}`}
              onClick={() => handleNavClick(s)}
            >
              <ion-icon name={sectionIcon(s)} />
              <span>{s}</span>
              {s === "Messages" && stats.unread > 0 && (
                <span className="badge">{stats.unread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-nav-btn"
          >
            <ion-icon name="eye-outline" />
            <span>View Site</span>
          </a>
          <button className="admin-nav-btn logout" onClick={handleLogout}>
            <ion-icon name="log-out-outline" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <ion-icon name={mobileOpen ? "close-outline" : "menu-outline"} />
            </button>
            <h1 className="topbar-title">{activeSection}</h1>
          </div>
          <div className="topbar-right">
            <span className="admin-user">
              <ion-icon name="person-circle-outline" />
              <span>Gopal Kute</span>
            </span>
          </div>
        </header>

        <div className="admin-content">
          {activeSection === "Overview" && <Overview stats={stats} />}
          {activeSection === "Profile" && <ProfileEditor />}
          {activeSection === "Projects" && <ProjectsManager />}
          {activeSection === "Skills" && <SkillsManager />}
          {activeSection === "Experience" && (
            <CrudManager
              title="Experience"
              endpoint="/experience"
              fields={expFields}
              blank={expBlank}
              renderSummary={(item) => (
                <>
                  <h4>{item.role}</h4>
                  <p className="item-sub">
                    {item.company} · {item.period}
                  </p>
                </>
              )}
            />
          )}
          {activeSection === "Education" && (
            <CrudManager
              title="Education"
              endpoint="/education"
              fields={eduFields}
              blank={eduBlank}
              renderSummary={(item) => (
                <>
                  <h4>{item.degree}</h4>
                  <p className="item-sub">
                    {item.institution} · {item.grade}
                  </p>
                </>
              )}
            />
          )}
          {activeSection === "Messages" && <MessagesManager />}
        </div>
      </main>
    </div>
  );
}
