import React, { useEffect, useMemo, useState } from "react";
import { api, clearToken, getToken, setToken } from "./lib/api";
import { Icon } from "./components/Icon";
import Modal from "./components/Modal";

const ICON_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X / Twitter" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "globe", label: "Website" },
  { value: "file", label: "Resume / File" },
  { value: "mail", label: "Email" },
];

function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70";
  const styles =
    variant === "ghost"
      ? "bg-white/0 hover:bg-white/5 border border-white/10 text-white/85"
      : variant === "danger"
        ? "bg-red-500/10 hover:bg-red-500/15 border border-red-400/30 text-red-100"
        : "bg-white/5 hover:bg-white/7 border border-white/10 text-white";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-white/85">{label}</span>
        {hint ? <span className="text-xs text-white/45">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 ${props.className || ""}`}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 ${props.className || ""}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20 ${props.className || ""}`}
    />
  );
}

function useHashRoute() {
  const [route, setRoute] = useState(() => {
    const h = String(window.location.hash || "");
    return h.includes("admin") ? "admin" : "public";
  });

  useEffect(() => {
    const onHash = () => {
      const h = String(window.location.hash || "");
      setRoute(h.includes("admin") ? "admin" : "public");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goPublic = () => {
    window.location.hash = "#/public";
  };
  const goAdmin = () => {
    window.location.hash = "#/admin";
  };

  return { route, goPublic, goAdmin };
}

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -left-44 -top-28 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(78,161,255,0.85),transparent_62%)] blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -right-44 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(139,91,255,0.85),transparent_62%)] blur-3xl opacity-30" />
    </div>
  );
}

function PublicView({ profile, links, onOpenLogin }) {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-dvh bg-bg text-white">
      <BackgroundOrbs />

      <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-8">
        <header className="grid justify-items-center text-center">
          <div className="rounded-full bg-gradient-to-br from-accent to-accent2 p-1 shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
            <img
              src={profile.avatarUrl}
              alt="Profile avatar"
              className="h-28 w-28 rounded-full bg-white/5 object-cover ring-1 ring-white/10"
              loading="eager"
            />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-2 max-w-[46ch] text-sm text-white/70">
            {profile.bio}
          </p>
        </header>

        <section className="mt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Links
          </h2>
          <div className="grid gap-3">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target={l.url?.startsWith("mailto:") ? undefined : "_blank"}
                rel={l.url?.startsWith("mailto:") ? undefined : "noreferrer"}
                className="group relative grid min-h-[64px] grid-cols-[44px_1fr_24px] items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-accent/40 focus:outline-none focus-visible:shadow-glow"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(320px 140px at 10% 0%, rgba(78,161,255,0.18), transparent 60%), radial-gradient(260px 120px at 90% 0%, rgba(139,91,255,0.14), transparent 60%)",
                  }}
                />
                <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                  <Icon name={l.iconName} className="h-5 w-5" />
                </div>
                <div className="relative min-w-0">
                  <div className="truncate text-sm font-semibold tracking-tight text-white/90">
                    {l.title}
                  </div>
                  <div className="truncate text-xs text-white/45">{l.url}</div>
                </div>
                <div className="relative text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white/65">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-8 grid justify-items-center gap-3">
          <div className="text-xs text-white/50">© {profile.name} {year}</div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-[11px] text-white/25 hover:text-white/45 transition"
            aria-label="Admin login"
            title="Admin login"
          >
            🔒
          </button>
        </footer>
      </main>
    </div>
  );
}

function LoginModal({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
  }, [open]);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.login(password);
      setToken(res.token);
      onSuccess?.();
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Admin Login" onClose={onClose}>
      <div className="grid gap-3">
        <Field label="Password" hint='Prototype: "admin123"'>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </Field>
        {error ? (
          <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={loading}
            className="border-accent/30"
          >
            {loading ? "Logging in…" : "Login"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AdminView({ token, profile, links, refresh, onLogout }) {
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkMode, setLinkMode] = useState("add"); // add | edit
  const [editing, setEditing] = useState(null);
  const [linkDraft, setLinkDraft] = useState({
    title: "",
    url: "",
    iconName: "globe",
  });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProfileDraft(profile);
  }, [profile]);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2200);
  };

  const saveProfile = async () => {
    setError("");
    setSavingProfile(true);
    try {
      await api.updateProfile(token, {
        name: profileDraft.name,
        bio: profileDraft.bio,
        avatarUrl: profileDraft.avatarUrl,
      });
      await refresh();
      showToast("Profile saved");
    } catch (e) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const openAdd = () => {
    setLinkMode("add");
    setEditing(null);
    setLinkDraft({ title: "", url: "", iconName: "globe" });
    setLinkModalOpen(true);
    setError("");
  };

  const openEdit = (l) => {
    setLinkMode("edit");
    setEditing(l);
    setLinkDraft({
      title: l.title,
      url: l.url,
      iconName: l.iconName || "globe",
    });
    setLinkModalOpen(true);
    setError("");
  };

  const saveLink = async () => {
    setError("");
    setBusy(true);
    try {
      if (linkMode === "edit") {
        await api.updateLink(token, editing.id, linkDraft);
        showToast("Link updated");
      } else {
        await api.addLink(token, linkDraft);
        showToast("Link added");
      }
      setLinkModalOpen(false);
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to save link");
    } finally {
      setBusy(false);
    }
  };

  const deleteLink = async (id) => {
    setError("");
    setBusy(true);
    try {
      await api.deleteLink(token, id);
      await refresh();
      showToast("Link deleted");
    } catch (e) {
      setError(e.message || "Failed to delete link");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg text-white">
      <BackgroundOrbs />

      <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Updates are saved to SQLite via the backend API.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" type="button" onClick={onLogout}>
              Logout
            </Button>
            <Button
              type="button"
              onClick={saveProfile}
              disabled={savingProfile}
              className="border-accent/30"
            >
              {savingProfile ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </div>

        {toast ? (
          <div className="mb-4 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-white/85">
            {toast}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="text-sm font-bold text-white/85">
              Profile Settings
            </h2>
            <div className="mt-3 grid gap-3">
              <Field label="Avatar URL" hint="https://...">
                <TextInput
                  value={profileDraft.avatarUrl}
                  onChange={(e) =>
                    setProfileDraft((p) => ({ ...p, avatarUrl: e.target.value }))
                  }
                  inputMode="url"
                  placeholder="https://…"
                />
              </Field>
              <Field label="Name">
                <TextInput
                  value={profileDraft.name}
                  onChange={(e) =>
                    setProfileDraft((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your Name"
                />
              </Field>
              <Field label="Bio">
                <TextArea
                  rows={4}
                  value={profileDraft.bio}
                  onChange={(e) =>
                    setProfileDraft((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="Short, punchy bio…"
                />
              </Field>
              <div className="mt-1 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={profileDraft.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0.2";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {profileDraft.name || "Preview"}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {profileDraft.bio || "Your bio will appear on the public page."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-white/85">Links Manager</h2>
              <Button variant="ghost" type="button" onClick={openAdd}>
                Add Link
              </Button>
            </div>

            <div className="mt-3 grid gap-2">
              {links.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                  No links yet. Add your first one.
                </div>
              ) : (
                links.map((l) => (
                  <div
                    key={l.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                        <Icon name={l.iconName} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">
                          {l.title}
                        </div>
                        <div className="truncate text-xs text-white/50">
                          {l.url}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => openEdit(l)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        type="button"
                        disabled={busy}
                        onClick={() => deleteLink(l.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal
        open={linkModalOpen}
        title={linkMode === "edit" ? "Edit Link" : "Add Link"}
        onClose={() => setLinkModalOpen(false)}
      >
        <div className="grid gap-3">
          <Field label="Title">
            <TextInput
              value={linkDraft.title}
              onChange={(e) =>
                setLinkDraft((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="e.g., GitHub"
            />
          </Field>
          <Field label="URL">
            <TextInput
              value={linkDraft.url}
              onChange={(e) =>
                setLinkDraft((p) => ({ ...p, url: e.target.value }))
              }
              inputMode="url"
              placeholder="https://… or mailto:…"
            />
          </Field>
          <Field label="Icon">
            <Select
              value={linkDraft.iconName}
              onChange={(e) =>
                setLinkDraft((p) => ({ ...p, iconName: e.target.value }))
              }
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setLinkModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveLink}
              disabled={busy}
              className="border-accent/30"
            >
              {busy ? "Saving…" : linkMode === "edit" ? "Update" : "Add"}
            </Button>
          </div>
          <div className="text-xs text-white/45">Required: Title + URL.</div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  const { route, goAdmin, goPublic } = useHashRoute();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [fatal, setFatal] = useState("");

  const token = useMemo(() => getToken(), [route]);
  const authed = Boolean(token);

  const refresh = async () => {
    setFatal("");
    setLoading(true);
    try {
      const [p, l] = await Promise.all([api.getProfile(), api.getLinks()]);
      setProfile(p);
      setLinks(l);
    } catch (e) {
      setFatal(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (route === "admin" && !authed) goPublic();
  }, [route, authed, goPublic]);

  if (loading && !profile) {
    return (
      <div className="min-h-dvh bg-bg text-white grid place-items-center">
        <div className="text-sm text-white/60">Loading…</div>
      </div>
    );
  }

  if (fatal) {
    return (
      <div className="min-h-dvh bg-bg text-white grid place-items-center p-6 text-center">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-base font-bold">Couldn’t load data</div>
          <div className="mt-2 text-sm text-white/60">{fatal}</div>
          <div className="mt-4">
            <Button type="button" onClick={refresh} className="border-accent/30">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const safeProfile = profile || {
    name: "Your Name",
    bio: "",
    avatarUrl: "",
  };

  return (
    <>
      {route === "admin" && authed ? (
        <AdminView
          token={token}
          profile={safeProfile}
          links={links}
          refresh={refresh}
          onLogout={() => {
            clearToken();
            goPublic();
          }}
        />
      ) : (
        <PublicView
          profile={safeProfile}
          links={links}
          onOpenLogin={() => setLoginOpen(true)}
        />
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          goAdmin();
        }}
      />
    </>
  );
}

