import { useState, useRef, useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme, toggleTheme, lang, setLang } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const avatar = user?.imageUrl;

  /* close dropdown on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const bg = isDark ? "#0f1117" : "#ffffff";
  const border = isDark ? "#1e2535" : "#e8eaf0";
  const text = isDark ? "#e2e8f0" : "#1a1f2e";
  const muted = isDark ? "#64748b" : "#6b7280";
  const pill = isDark ? "#1e2535" : "#f1f3f8";
  const pillHov = isDark ? "#2a3347" : "#e4e7f0";
  const menuBg = isDark ? "#151b27" : "#ffffff";
  const menuBord = isDark ? "#1e2535" : "#e8eaf0";
  const ORANGE = "#e8733a";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "62px",
        padding: "0 28px",
        background: bg,
        borderBottom: `1px solid ${border}`,
        boxShadow: isDark
          ? "0 1px 12px rgba(0,0,0,0.4)"
          : "0 1px 8px rgba(0,0,0,0.07)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── LEFT: Logo ─────────────────────────────────────── */}
      <img
        src="/bayanplat.svg"
        alt="Insight Solar Twin"
        style={{ height: "38px", objectFit: "contain" }}
      />

      {/* ── RIGHT: controls ────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Language toggle */}
        <div
          style={{
            display: "flex",
            background: pill,
            borderRadius: "50px",
            padding: "3px",
            gap: "2px",
          }}
        >
          {(["EN", "FR"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "4px 12px",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "inherit",
                letterSpacing: "0.5px",
                transition: "all 0.18s",
                background: lang === l ? ORANGE : "transparent",
                color: lang === l ? "#fff" : muted,
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: pill,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isDark ? "#fbbf24" : "#6366f1",
            transition: "background 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = pillHov)}
          onMouseLeave={(e) => (e.currentTarget.style.background = pill)}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Separator */}
        <div
          style={{
            width: "1px",
            height: "24px",
            background: border,
            margin: "0 4px",
          }}
        />

        {/* User menu */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: menuOpen ? pill : "transparent",
              border: `1px solid ${menuOpen ? border : "transparent"}`,
              borderRadius: "50px",
              padding: "5px 12px 5px 5px",
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = pill;
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Avatar */}
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${ORANGE}, #c4582a)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Name + email */}
            <div style={{ textAlign: "left", lineHeight: 1.2 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: text,
                }}
              >
                {name}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: muted }}>
                {email}
              </p>
            </div>
            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={muted}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: menuOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.18s",
                marginLeft: "2px",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                minWidth: "210px",
                background: menuBg,
                border: `1px solid ${menuBord}`,
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              {/* User info header */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${menuBord}`,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: text,
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: muted,
                    marginTop: "2px",
                  }}
                >
                  {email}
                </p>
              </div>

              {/* Log out */}
              <button
                onClick={() => signOut({ redirectUrl: "/sign-in" })}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = isDark
                    ? "#1e1a1a"
                    : "#fff5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <LogOutIcon />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
