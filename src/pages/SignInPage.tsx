import { useState, FormEvent } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

/* ── palette ────────────────────────────────────────────────── */
const ORANGE = "#e8733a"; // cold-leaning orange
const ORANGE_H = "#d45f28"; // hover
const WHITE_90 = "rgba(255,255,255,0.92)";
const WHITE_60 = "rgba(255,255,255,0.60)";
const WHITE_40 = "rgba(255,255,255,0.40)";
const TEXT = "#1a0f06";
const MUTED = "#6b4c34";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

type View = "login" | "forgot-send" | "forgot-reset" | "forgot-done";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const navigate = useNavigate();

  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── Login ─────────────────────────────────────────────────── */
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      }
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message ??
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ── Forgot – send code ─────────────────────────────────────── */
  async function handleSendReset(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setView("forgot-reset");
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message ??
          "Could not send reset email.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ── Forgot – confirm code + new password ─────────────────── */
  async function handleConfirmReset(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPass,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      }
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message ??
          "Invalid code or password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(/signin.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        fontFamily: SANS,
      }}
    >
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,8,0,0.28)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginBottom: "36px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/bayanplat.svg"
          alt="Insight Solar Twin"
          style={{
            height: "70px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
          }}
        />
        <p
          style={{
            fontFamily: SERIF,
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: WHITE_60,
            margin: "8px 0 0",
            fontWeight: 500,
          }}
        >
          Solar Digital Twin Platform
        </p>
      </div>

      {/* ── LOGIN VIEW ─────────────────────────────────────────── */}
      {view === "login" && (
        <form
          onSubmit={handleLogin}
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              maxWidth: "660px",
            }}
          >
            <Field icon={<UserIcon />} style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Username / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </Field>

            <Field icon={<LockIcon />} style={{ flex: 1 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </Field>

            <Btn type="submit" loading={loading}>
              Log In
            </Btn>
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <div
            style={{
              display: "flex",
              gap: "18px",
              fontSize: "13px",
              color: WHITE_60,
              marginTop: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setError("");
                setView("forgot-send");
              }}
              style={ghostLink}
            >
              Forgot password?
            </button>
            <Divider />
            <a href="#" style={ghostLink}>
              Privacy Statement
            </a>
            <Divider />
            <a href="#" style={ghostLink}>
              User Agreement
            </a>
          </div>
        </form>
      )}

      {/* ── FORGOT – SEND EMAIL ───────────────────────────────── */}
      {view === "forgot-send" && (
        <form onSubmit={handleSendReset} style={cardStyle}>
          <h2 style={cardTitle}>Reset Password</h2>
          <p style={cardSub}>
            Enter your account email and we'll send a reset code.
          </p>

          <Field icon={<UserIcon />}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ ...inputStyle, color: TEXT }}
            />
          </Field>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <Btn
              type="button"
              secondary
              onClick={() => {
                setError("");
                setView("login");
              }}
            >
              Back
            </Btn>
            <Btn type="submit" loading={loading}>
              Send Code
            </Btn>
          </div>
        </form>
      )}

      {/* ── FORGOT – ENTER CODE + NEW PASSWORD ───────────────── */}
      {view === "forgot-reset" && (
        <form onSubmit={handleConfirmReset} style={cardStyle}>
          <h2 style={cardTitle}>Set New Password</h2>
          <p style={cardSub}>
            Enter the code sent to <strong>{email}</strong> and choose a new
            password.
          </p>

          <Field icon={<CodeIcon />}>
            <input
              type="text"
              placeholder="Reset code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ ...inputStyle, color: TEXT }}
            />
          </Field>

          <Field icon={<LockIcon />}>
            <input
              type="password"
              placeholder="New password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              style={{ ...inputStyle, color: TEXT }}
            />
          </Field>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <Btn
              type="button"
              secondary
              onClick={() => {
                setError("");
                setView("forgot-send");
              }}
            >
              Back
            </Btn>
            <Btn type="submit" loading={loading}>
              Reset Password
            </Btn>
          </div>
        </form>
      )}

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "14px",
          zIndex: 1,
          fontSize: "12px",
          color: WHITE_40,
          margin: 0,
          fontFamily: SANS,
        }}
      >
        Copyright © 2024–2026 Insight Solar Twin. All rights reserved.
      </p>
    </div>
  );
}

/* ── Sub-components ────────────────────────────────────────── */

function Field({
  icon,
  children,
  style,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: WHITE_90,
        borderRadius: "50px",
        height: "46px",
        padding: "0 16px",
        gap: "10px",
        border: `1.5px solid rgba(232,115,58,0.35)`,
        ...style,
      }}
    >
      <span style={{ color: ORANGE, flexShrink: 0, display: "flex" }}>
        {icon}
      </span>
      {children}
    </div>
  );
}

function Btn({
  children,
  type = "button",
  loading = false,
  secondary = false,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  secondary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      style={{
        height: "46px",
        padding: "0 26px",
        background: secondary
          ? "transparent"
          : loading
            ? `${ORANGE}99`
            : ORANGE,
        color: secondary ? WHITE_90 : "white",
        border: secondary ? `1.5px solid ${WHITE_60}` : "none",
        borderRadius: "50px",
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: SANS,
        cursor: loading ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        letterSpacing: "0.4px",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!loading && !secondary)
          (e.currentTarget as HTMLButtonElement).style.background = ORANGE_H;
      }}
      onMouseLeave={(e) => {
        if (!loading && !secondary)
          (e.currentTarget as HTMLButtonElement).style.background = ORANGE;
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function Divider() {
  return <span style={{ color: WHITE_40 }}>|</span>;
}

function UserIcon() {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="4" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CodeIcon() {
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
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  );
}

/* ── Shared styles ─────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: TEXT,
  fontFamily: SANS,
  height: "100%",
};

const errorStyle: React.CSSProperties = {
  color: "#fca5a5",
  fontSize: "13px",
  margin: 0,
  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
};

const ghostLink: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: WHITE_60,
  fontFamily: SANS,
  fontSize: "13px",
  textDecoration: "none",
  transition: "color 0.15s",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  background: "rgba(255,255,255,0.88)",
  borderRadius: "16px",
  padding: "32px 36px",
  width: "100%",
  maxWidth: "400px",
  backdropFilter: "blur(14px)",
  border: `1.5px solid rgba(232,115,58,0.25)`,
  boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontFamily: SERIF,
  fontSize: "26px",
  fontWeight: 600,
  color: TEXT,
  letterSpacing: "-0.3px",
};

const cardSub: React.CSSProperties = {
  margin: 0,
  fontSize: "13px",
  color: MUTED,
  fontFamily: SANS,
  lineHeight: 1.5,
};
