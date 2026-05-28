import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Phone,
  Clock,
  CalendarX,
  FileText,
  Headphones,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Workflow,
  Check,
  ChevronDown,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Activity,
  Stethoscope,
  ClipboardList,
  Zap,
  Send,
  Calendar,
} from "lucide-react";

// ---------- Design tokens ----------
const C = {
  bg: "#0A0A0A",
  bgRaised: "#111111",
  bgCard: "#151513",
  bgCardHover: "#1B1B19",
  border: "#26241F",
  borderStrong: "#3A372F",
  text: "#F4EFE3",
  textDim: "#B8B2A3",
  textMuted: "#807A6C",
  accent: "#FFB628",
  accentSoft: "rgba(255, 182, 40, 0.12)",
  accentDim: "#B3801C",
};

const F = {
  display: "'Instrument Serif', 'Times New Roman', serif",
  body: "'DM Sans', system-ui, -apple-system, sans-serif",
};

// ---------- Reduced motion preference ----------
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update);
    };
  }, []);
  return reduce;
}

// ---------- Booking context ----------
const BookingContext = createContext(() => {});
function useBooking() {
  return useContext(BookingContext);
}

// ---------- useInView (IntersectionObserver) ----------
function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      options || { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "", style = {} }) {
  const [ref, inView] = useInView();
  const reduceMotion = usePrefersReducedMotion();
  const visible = reduceMotion || inView;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: reduceMotion
          ? "none"
          : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// ---------- Global styles + fonts ----------
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

      html { scroll-behavior: smooth; }
      body { background: ${C.bg}; color: ${C.text}; font-family: ${F.body}; -webkit-font-smoothing: antialiased; }
      * { box-sizing: border-box; }

      .font-display { font-family: ${F.display}; font-weight: 400; letter-spacing: -0.01em; }
      .font-body { font-family: ${F.body}; }

      /* Grain overlay */
      .grain::before {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.89  0 0 0 0.14 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        opacity: 0.5; mix-blend-mode: overlay;
      }

      /* Slow mesh drift */
      @keyframes drift {
        0%   { transform: translate3d(0%, 0%, 0) scale(1); }
        50%  { transform: translate3d(4%, -3%, 0) scale(1.08); }
        100% { transform: translate3d(0%, 0%, 0) scale(1); }
      }
      .mesh-a { animation: drift 22s ease-in-out infinite; }
      .mesh-b { animation: drift 30s ease-in-out infinite reverse; }

      /* Marquee for stat strip — purely decorative */
      @keyframes pulse-dot {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50%      { opacity: 1;   transform: scale(1.25); }
      }
      .pulse-dot { animation: pulse-dot 1.8s ease-in-out infinite; }

      /* Hover lift */
      .lift { transition: transform 320ms cubic-bezier(0.22,1,0.36,1), border-color 320ms ease, background 320ms ease; }
      .lift:hover { transform: translateY(-3px); }

      /* Accordion */
      .acc-body { overflow: hidden; transition: max-height 420ms cubic-bezier(0.22,1,0.36,1), opacity 320ms ease; }

      /* Buttons */
      .btn-primary { background: ${C.accent}; color: #1A1407; transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease; }
      .btn-primary:hover { background: #FFC44D; box-shadow: 0 12px 32px -10px rgba(255,182,40,0.55); transform: translateY(-1px); }
      .btn-ghost { border: 1px solid ${C.borderStrong}; color: ${C.text}; transition: border-color 220ms ease, background 220ms ease, transform 220ms ease; }
      .btn-ghost:hover { border-color: ${C.accent}; background: ${C.accentSoft}; transform: translateY(-1px); }

      /* Sticky nav background */
      .nav-blur { backdrop-filter: saturate(140%) blur(14px); -webkit-backdrop-filter: saturate(140%) blur(14px); }

      /* Selection */
      ::selection { background: ${C.accent}; color: #1A1407; }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: ${C.borderStrong}; }

      /* Focus rings — keyboard a11y */
      :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 3px; border-radius: 6px; }

      /* Respect users who prefer reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }
        .mesh-a, .mesh-b, .pulse-dot { animation: none !important; }
        html { scroll-behavior: auto; }
      }

      /* Modal */
      @keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes modal-rise { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .modal-backdrop { animation: modal-fade 220ms ease-out; }
      .modal-card { animation: modal-rise 320ms cubic-bezier(0.22,1,0.36,1); }
    `}</style>
  );
}

// ---------- Booking Modal ----------
//
// This modal is intentionally backend-agnostic. Three easy ways to wire it up:
//
//   1) Formspree / Basin / Web3Forms — replace BOOKING_FORM_ENDPOINT below with
//      your form's POST URL. No other code changes needed.
//
//   2) Cal.com / Calendly — replace the <form> in BookingModal with an iframe:
//      <iframe src="https://cal.com/your-handle/practice-audit" ... />
//      Delete the form state below.
//
//   3) Your own API — point BOOKING_FORM_ENDPOINT at your endpoint and adapt
//      the JSON body in handleSubmit.
//
const BOOKING_FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

function BookingModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    practice: "",
    role: "Owner / Doctor",
    phone: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Lock body scroll, focus first field, close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => firstFieldRef.current && firstFieldRef.current.focus(), 60);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Reset back to idle a moment after closing
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (!BOOKING_FORM_ENDPOINT) {
      // Demo mode — pretend it worked. Wire up BOOKING_FORM_ENDPOINT to send for real.
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(BOOKING_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err && err.message ? err.message : "Something went wrong.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: "rgba(5, 5, 5, 0.78)", backdropFilter: "blur(8px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        ref={dialogRef}
        className="modal-card relative w-full max-w-lg rounded-2xl my-8 sm:my-0"
        style={{
          background: C.bgCard,
          border: `1px solid ${C.borderStrong}`,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-7 pb-5">
          <div>
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] mb-3"
              style={{ background: C.accentSoft, color: C.accent }}
            >
              <Calendar size={12} /> Free Practice Audit · 30 min
            </div>
            <h2
              id="booking-title"
              className="font-display text-3xl sm:text-4xl leading-tight"
              style={{ color: C.text }}
            >
              Let's find the time you're losing.
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              border: `1px solid ${C.border}`,
              color: C.textDim,
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.accent;
              e.currentTarget.style.color = C.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textDim;
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        {status === "success" ? (
          <div className="px-7 pb-8">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: C.accentSoft }}
            >
              <Check size={22} color={C.accent} strokeWidth={2.5} />
            </div>
            <h3 className="font-display text-2xl mt-5" style={{ color: C.text }}>
              You're on the list.
            </h3>
            <p className="text-base mt-2 leading-relaxed" style={{ color: C.textDim }}>
              We'll reach out within one business day to schedule your 30-minute
              audit. Check your inbox (and spam folder, just in case).
            </p>
            <button
              onClick={onClose}
              className="btn-ghost mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 pb-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your name" htmlFor="bf-name">
                <input
                  id="bf-name"
                  ref={firstFieldRef}
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Dr. Lena Voss"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" htmlFor="bf-email">
                <input
                  id="bf-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="you@practice.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Practice name" htmlFor="bf-practice">
                <input
                  id="bf-practice"
                  required
                  value={form.practice}
                  onChange={onChange("practice")}
                  placeholder="Voss Family Dental"
                />
              </Field>
              <Field label="Your role" htmlFor="bf-role">
                <select id="bf-role" value={form.role} onChange={onChange("role")}>
                  {[
                    "Owner / Doctor",
                    "Practice Manager",
                    "Operations / COO",
                    "Front Desk Lead",
                    "Other",
                  ].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Phone (optional)" htmlFor="bf-phone">
                <input
                  id="bf-phone"
                  type="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  placeholder="(512) 555-0142"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Biggest bottleneck (optional)" htmlFor="bf-notes" full>
                <textarea
                  id="bf-notes"
                  rows={3}
                  value={form.notes}
                  onChange={onChange("notes")}
                  placeholder="Tell us where the friction is — insurance, intake, no-shows, charting, etc."
                />
              </Field>
            </div>

            {status === "error" && (
              <div
                className="mt-5 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(220, 80, 50, 0.08)",
                  border: "1px solid rgba(220, 80, 50, 0.35)",
                  color: "#FFB199",
                }}
              >
                Couldn't submit your request: {errorMsg}. Please try again or email
                hello@pulseautomation.co.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-medium"
              style={{ opacity: status === "submitting" ? 0.7 : 1 }}
            >
              {status === "submitting" ? (
                "Sending…"
              ) : (
                <>
                  Request my audit <Send size={14} strokeWidth={2.5} />
                </>
              )}
            </button>

            <p className="text-xs mt-4 text-center" style={{ color: C.textMuted }}>
              No contracts. No obligation. We respond within one business day.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children, full = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className={"flex flex-col gap-1.5 " + (full ? "sm:col-span-2" : "")}
    >
      <span className="text-xs uppercase tracking-wider" style={{ color: C.textMuted }}>
        {label}
      </span>
      {React.cloneElement(children, {
        className:
          (children.props.className || "") +
          " w-full px-3.5 py-2.5 rounded-lg text-sm",
        style: {
          background: C.bg,
          color: C.text,
          border: `1px solid ${C.border}`,
          outline: "none",
          fontFamily: F.body,
          ...(children.props.style || {}),
        },
        onFocus: (e) => {
          e.currentTarget.style.borderColor = C.accent;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${C.accentSoft}`;
        },
        onBlur: (e) => {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.boxShadow = "none";
        },
      })}
    </label>
  );
}

// ---------- Nav ----------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openBooking = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#results", label: "Results" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 nav-blur"
      style={{
        background: scrolled ? "rgba(10,10,10,0.78)" : "transparent",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "background 320ms ease, border-color 320ms ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
        <a href="#top" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: C.accent, boxShadow: `0 0 24px ${C.accentSoft}` }}
          >
            <Activity size={16} strokeWidth={2.5} color="#1A1407" />
          </div>
          <span
            className="font-display text-2xl"
            style={{ color: C.text, letterSpacing: "-0.02em" }}
          >
            Pulse <span style={{ color: C.accent }}>Automation</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm"
              style={{ color: C.textDim, transition: "color 200ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={openBooking}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          >
            Book a Call <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ color: C.text }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden px-6 pb-6 pt-2"
          style={{ background: "rgba(10,10,10,0.96)", borderTop: `1px solid ${C.border}` }}
        >
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base py-1"
                style={{ color: C.textDim }}
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-medium mt-2"
            >
              Book a Call <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  const openBooking = useBooking();
  return (
    <section id="top" className="relative overflow-hidden pt-32 lg:pt-44 pb-24 lg:pb-32">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 grain" aria-hidden="true">
        <div
          className="absolute mesh-a"
          style={{
            top: "-20%",
            left: "-10%",
            width: "70%",
            height: "70%",
            background: `radial-gradient(closest-side, rgba(255,182,40,0.18), transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute mesh-b"
          style={{
            bottom: "-30%",
            right: "-15%",
            width: "65%",
            height: "65%",
            background: `radial-gradient(closest-side, rgba(255,182,40,0.07), transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        {/* faint grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,239,227,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,227,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
            style={{
              background: C.accentSoft,
              color: C.accent,
              border: `1px solid ${C.accentSoft}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: C.accent }}
            />
            Now onboarding Q3 2026 practices
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] max-w-5xl"
            style={{ color: C.text }}
          >
            Your practice runs on people.<br />
            <span style={{ fontStyle: "italic", color: C.accent }}>
              Let AI handle the rest.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p
            className="mt-8 text-lg lg:text-xl max-w-2xl leading-relaxed"
            style={{ color: C.textDim }}
          >
            We build AI-powered systems for healthcare and dental practices that
            eliminate admin bottlenecks, cut overhead, and let your team focus
            on patient care — not paperwork.
          </p>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={openBooking}
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium text-base"
            >
              Book a Free Practice Audit
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <a
              href="#process"
              className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium text-base"
            >
              See How It Works
            </a>
          </div>
        </Reveal>

        <Reveal delay={420}>
          <div
            className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm"
            style={{ color: C.textMuted }}
          >
            <span style={{ color: C.textDim }}>Trusted by practices using:</span>
            {["Dentrix", "Epic", "Athenahealth", "Eaglesoft", "Open Dental"].map(
              (n) => (
                <span
                  key={n}
                  className="font-display text-xl"
                  style={{ color: C.textDim, letterSpacing: "0.02em" }}
                >
                  {n}
                </span>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Pain Points ----------
function PainPoints() {
  const items = [
    {
      icon: Clock,
      title: "15+ hours a week lost to paperwork",
      body:
        "Staff burn entire days on insurance verification, eligibility checks, and manual data entry that a system can do in seconds.",
    },
    {
      icon: Phone,
      title: "Calls going straight to voicemail",
      body:
        "Peak-hour overflow means missed appointments, frustrated patients, and revenue walking next door before lunch.",
    },
    {
      icon: CalendarX,
      title: "No-shows quietly draining revenue",
      body:
        "Without intelligent reminders and waitlist routing, an empty chair costs the average practice thousands every month.",
    },
    {
      icon: FileText,
      title: "Charting and billing after hours",
      body:
        "Clinicians and front-desk staff finishing notes at 9pm is not a workflow — it's a slow path to burnout and turnover.",
    },
  ];

  return (
    <section id="problem" className="relative py-24 lg:py-32 border-t" style={{ borderColor: C.border }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
            The Problem
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-3xl leading-[1.05]"
            style={{ color: C.text }}
          >
            Your front desk is <span style={{ fontStyle: "italic", color: C.accent }}>drowning</span> in busywork.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-base lg:text-lg" style={{ color: C.textDim }}>
            Every practice we audit tells the same story. The work isn't clinical — it's
            clerical. And it scales linearly with patient volume, until something snaps.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.title} delay={i * 90}>
                <div
                  className="lift rounded-2xl p-7 h-full"
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 1px 0 rgba(255,255,255,0.02) inset",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderStrong)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: C.accentSoft, border: `1px solid ${C.accentSoft}` }}
                  >
                    <Icon size={20} color={C.accent} strokeWidth={2} />
                  </div>
                  <h3
                    className="font-display text-2xl lg:text-3xl mt-5"
                    style={{ color: C.text }}
                  >
                    {it.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed" style={{ color: C.textDim }}>
                    {it.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Services ----------
function Services() {
  const items = [
    {
      icon: Sparkles,
      name: "Patient Intake & Follow-Up Automation",
      body:
        "AI-powered new patient onboarding, automated appointment confirmations, post-visit follow-ups, and review requests — all branded to your practice.",
    },
    {
      icon: Headphones,
      name: "Front Desk AI Assistant",
      body:
        "Intelligent call handling, an after-hours virtual receptionist, FAQ responses, and appointment scheduling via phone, text, or chat.",
    },
    {
      icon: ShieldCheck,
      name: "Insurance Verification & Billing",
      body:
        "Automated eligibility checks, claim pre-processing, coding assistance, and denial follow-up workflows that keep cash flowing.",
    },
    {
      icon: RefreshCw,
      name: "Appointment & Recall Automation",
      body:
        "Smart scheduling, no-show prediction, automated reminders, waitlist management, and recall campaigns for overdue patients.",
    },
    {
      icon: ClipboardList,
      name: "Clinical Documentation Support",
      body:
        "AI-assisted charting, note summarization, template generation, and EHR data entry reduction so clinicians stop typing after hours.",
    },
    {
      icon: Workflow,
      name: "Custom Practice Workflows",
      body:
        "Bespoke multi-step automations tailored to your practice's unique operations and software stack — from referrals to reactivation.",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-24 lg:py-32 border-t"
      style={{ borderColor: C.border, background: C.bgRaised }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
                What we build
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-3xl leading-[1.05]"
                style={{ color: C.text }}
              >
                Built for the way your <span style={{ fontStyle: "italic", color: C.accent }}>practice</span> actually runs.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-md text-base" style={{ color: C.textDim }}>
              Every system is HIPAA-aligned, integrated with your existing
              tools, and shipped with a human you can call.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal key={it.name} delay={i * 80}>
                <div
                  className="lift rounded-2xl p-7 h-full group cursor-default"
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${C.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.background = C.bgCardHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.bgCard;
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: C.accentSoft }}
                    >
                      <Icon size={20} color={C.accent} strokeWidth={2} />
                    </div>
                    <ArrowUpRight size={18} color={C.textMuted} />
                  </div>
                  <h3
                    className="text-xl mt-6 font-semibold"
                    style={{ color: C.text, letterSpacing: "-0.01em" }}
                  >
                    {it.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.textDim }}>
                    {it.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Process ----------
function Process() {
  const steps = [
    {
      n: "01",
      name: "Audit",
      body:
        "We analyze your practice workflows and identify the highest-ROI automation opportunities. Free, no obligation.",
    },
    {
      n: "02",
      name: "Build",
      body:
        "We design and deploy your custom AI systems in 2–4 weeks, integrating with your existing PMS, EHR, and tools. You approve everything before it goes live.",
    },
    {
      n: "03",
      name: "Scale",
      body:
        "We monitor, optimize, and expand your automations as your practice grows. Ongoing support included.",
    },
  ];

  return (
    <section id="process" className="relative py-24 lg:py-32 border-t" style={{ borderColor: C.border }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
            Our Process
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-4xl leading-[1.05]"
            style={{ color: C.text }}
          >
            From chaos to automation in <span style={{ fontStyle: "italic", color: C.accent }}>3 steps</span>.
          </h2>
        </Reveal>

        <div className="mt-16 relative">
          {/* connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-9 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${C.borderStrong} 12%, ${C.borderStrong} 88%, transparent)`,
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 relative">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 140}>
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-display text-2xl"
                      style={{
                        background: C.bg,
                        border: `1px solid ${C.borderStrong}`,
                        color: C.accent,
                        boxShadow: `0 0 0 6px ${C.bg}`,
                      }}
                    >
                      {s.n}
                    </div>
                    <h3
                      className="font-display text-4xl lg:text-5xl"
                      style={{ color: C.text }}
                    >
                      {s.name}
                    </h3>
                  </div>
                  <p
                    className="mt-6 text-base lg:text-lg leading-relaxed max-w-md"
                    style={{ color: C.textDim }}
                  >
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Testimonials + Stats ----------
function Results() {
  const t = [
    {
      metric: "32 hrs/week",
      metricLabel: "saved at front desk",
      quote:
        "We were drowning in insurance calls before Pulse. Now our staff actually leaves on time, and we're seeing more patients than ever.",
      name: "Dr. Lena Voss",
      title: "Owner",
      company: "Voss Family Dental, Austin",
    },
    {
      metric: "40%",
      metricLabel: "fewer no-shows",
      quote:
        "Their no-show prediction model is genuinely uncanny. We filled almost half a million in formerly-lost chair time last year.",
      name: "Marcus Hadley",
      title: "Practice Manager",
      company: "Bright Smiles Orthodontics Group",
    },
    {
      metric: "90%",
      metricLabel: "faster insurance verification",
      quote:
        "Verifications that took 20 minutes a patient now happen before they walk in the door. Our billing team is finally proactive, not reactive.",
      name: "Dana Okafor",
      title: "Operations Director",
      company: "Rapid Care Urgent (12 locations)",
    },
  ];

  const stats = [
    { value: "80+", label: "Practices Automated" },
    { value: "1,200+", label: "Staff Hours Saved Weekly" },
    { value: "98%", label: "Client Retention" },
    { value: "$2.4M+", label: "Revenue Protected for Clients" },
  ];

  return (
    <section
      id="results"
      className="relative py-24 lg:py-32 border-t"
      style={{ borderColor: C.border, background: C.bgRaised }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
            Results
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-3xl leading-[1.05]"
            style={{ color: C.text }}
          >
            Real results from <span style={{ fontStyle: "italic", color: C.accent }}>real practices</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {t.map((card, i) => (
            <Reveal key={card.name} delay={i * 100}>
              <div
                className="rounded-2xl p-8 h-full flex flex-col"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="font-display text-5xl lg:text-6xl leading-none"
                  style={{ color: C.accent }}
                >
                  {card.metric}
                </div>
                <div className="text-sm mt-2" style={{ color: C.textMuted }}>
                  {card.metricLabel}
                </div>

                <p
                  className="font-display italic text-xl lg:text-2xl mt-8 leading-snug"
                  style={{ color: C.text }}
                >
                  "{card.quote}"
                </p>

                <div className="mt-auto pt-8 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display text-base"
                    style={{
                      background: C.accentSoft,
                      color: C.accent,
                      border: `1px solid ${C.accentSoft}`,
                    }}
                  >
                    {card.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: C.text }}>
                      {card.name}
                    </div>
                    <div className="text-xs" style={{ color: C.textMuted }}>
                      {card.title} · {card.company}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div
            className="mt-16 rounded-2xl px-8 py-10 lg:px-12 lg:py-12 grid grid-cols-2 lg:grid-cols-4 gap-8"
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
            }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="font-display text-5xl lg:text-6xl leading-none"
                  style={{ color: C.text, letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-sm mt-3 uppercase tracking-wider"
                  style={{ color: C.textMuted }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Pricing ----------
function Pricing() {
  const openBooking = useBooking();
  const tiers = [
    {
      name: "Starter",
      price: "$2,500",
      priceSub: "one-time + $500/mo",
      desc: "For solo or small practices ready to remove one painful bottleneck.",
      features: [
        "1 core automation",
        "Monitoring & support",
        "Monthly optimization check-in",
        "Slack + email support",
      ],
      popular: false,
    },
    {
      name: "Growth",
      price: "$5,000",
      priceSub: "one-time + $1,200/mo",
      desc: "For growing multi-provider practices stacking multiple wins.",
      features: [
        "Up to 3 automations",
        "Priority support",
        "Bi-weekly optimization",
        "Quarterly strategy review",
        "Custom integrations included",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      priceSub: "tailored to your group",
      desc: "For DSOs, MSOs, and multi-location groups operating at scale.",
      features: [
        "Unlimited automations",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom integrations & data work",
        "Quarterly executive reviews",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 lg:py-32 border-t" style={{ borderColor: C.border }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
            Pricing
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-3xl leading-[1.05]"
            style={{ color: C.text }}
          >
            Transparent pricing, <span style={{ fontStyle: "italic", color: C.accent }}>no surprises</span>.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-base lg:text-lg" style={{ color: C.textDim }}>
            One-time build fee covers design, integration, and go-live. The
            monthly retainer covers monitoring, optimization, and a human on
            the other end of the line.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div
                className="lift rounded-2xl p-8 h-full flex flex-col relative"
                style={{
                  background: t.popular ? C.bgCard : C.bgCard,
                  border: t.popular ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                  boxShadow: t.popular
                    ? `0 20px 60px -30px rgba(255,182,40,0.6)`
                    : "none",
                }}
              >
                {t.popular && (
                  <div
                    className="absolute -top-3 left-8 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: C.accent, color: "#1A1407" }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="text-sm uppercase tracking-widest" style={{ color: C.textMuted }}>
                  {t.name}
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span
                    className="font-display text-5xl lg:text-6xl"
                    style={{ color: C.text }}
                  >
                    {t.price}
                  </span>
                </div>
                <div className="text-sm mt-1" style={{ color: C.textDim }}>
                  {t.priceSub}
                </div>

                <p className="text-base mt-5 leading-relaxed" style={{ color: C.textDim }}>
                  {t.desc}
                </p>

                <div
                  className="h-px my-7"
                  style={{ background: C.border }}
                />

                <ul className="flex flex-col gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm" style={{ color: C.text }}>
                      <span
                        className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.accentSoft }}
                      >
                        <Check size={11} strokeWidth={3} color={C.accent} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={openBooking}
                  className={
                    "mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium " +
                    (t.popular ? "btn-primary" : "btn-ghost")
                  }
                >
                  Get Started <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function FAQ() {
  const items = [
    {
      q: "How long does it take to set up an automation?",
      a: "Most builds ship in 2–4 weeks from kickoff. Simple front-desk automations can be live in under 10 days; integrations that touch your EHR or claims pipeline typically take the full 4 weeks because we do real testing against your data before flipping anything on.",
    },
    {
      q: "Do we need any technical knowledge on our end?",
      a: "No. You need a decision-maker who can answer questions about how your practice runs, and an admin who can grant access to your PMS or EHR. We handle every line of code, every integration, and every deployment. If we need a setting changed in Dentrix or Epic, we'll walk your team through it once.",
    },
    {
      q: "What practice management systems and EHRs do you integrate with?",
      a: "Dentrix, Eaglesoft, Open Dental, Curve, Epic, Athenahealth, NextGen, Kareo, DrChrono, eClinicalWorks, and most modern PMS/EHR platforms. If you're on something niche, we'll do a free integration scoping call before you sign anything.",
    },
    {
      q: "Is patient data safe? Are you HIPAA compliant?",
      a: "Yes. We sign a BAA before any build begins. Patient data is encrypted in transit and at rest, access is role-based and audited, and we never train AI models on your patient data. Our infrastructure runs on HIPAA-eligible AWS services with annual third-party security reviews.",
    },
    {
      q: "What happens if something breaks?",
      a: "You have a real human on Slack and email during business hours, and a 24/7 monitoring system on every automation. If a critical workflow goes down we have it acknowledged within 30 minutes and the standard SLA is full restoration the same business day.",
    },
    {
      q: "Can I cancel my retainer anytime?",
      a: "Yes. Retainers are month-to-month with 30 days notice. The one-time build fee is yours — we won't disable anything you've paid to build. We'd rather keep clients by being useful than by trapping them in a contract.",
    },
    {
      q: "How do you measure ROI for our practice?",
      a: "During the audit we lock in a baseline (hours spent, no-show rate, verification turnaround, collection rates — whatever is relevant). Every quarter we report the delta in plain English. If the math doesn't work, we'll tell you before you do.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-32 border-t"
      style={{ borderColor: C.border, background: C.bgRaised }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: C.accent }}>
            FAQ
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-3xl leading-[1.05]"
            style={{ color: C.text }}
          >
            Questions? <span style={{ fontStyle: "italic", color: C.accent }}>We've got answers.</span>
          </h2>
        </Reveal>

        <div className="mt-12">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={it.q} delay={i * 40}>
                <div
                  className="border-b"
                  style={{ borderColor: C.border }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="font-display text-xl lg:text-2xl"
                      style={{ color: C.text }}
                    >
                      {it.q}
                    </span>
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isOpen ? C.accent : "transparent",
                        border: `1px solid ${isOpen ? C.accent : C.borderStrong}`,
                        transition: "all 240ms ease",
                      }}
                    >
                      <ChevronDown
                        size={16}
                        color={isOpen ? "#1A1407" : C.textDim}
                        style={{
                          transition: "transform 320ms ease",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    className="acc-body"
                    style={{
                      maxHeight: isOpen ? "400px" : "0px",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p
                      className="pb-7 pr-12 text-base lg:text-lg leading-relaxed"
                      style={{ color: C.textDim }}
                    >
                      {it.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Final CTA ----------
function FinalCTA() {
  const openBooking = useBooking();
  return (
    <section id="cta" className="relative py-24 lg:py-36 overflow-hidden">
      {/* Accent background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${C.accent} 0%, #FFCB5A 100%)`,
        }}
      />
      <div
        className="absolute inset-0 grain"
        style={{ opacity: 0.6 }}
      />
      {/* Dark texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95]"
            style={{ color: "#1A1407", letterSpacing: "-0.02em" }}
          >
            Stop paying your staff to do a <span style={{ fontStyle: "italic" }}>robot's</span> job.
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p
            className="mt-8 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#3A2D08" }}
          >
            Book a free 30-minute practice automation audit. We'll show you
            exactly where your practice is bleeding time and money — and how
            to fix it.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={openBooking}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-medium text-base"
              style={{
                background: "#1A1407",
                color: C.accent,
                transition: "transform 220ms ease, box-shadow 220ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 16px 40px -12px rgba(26,20,7,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Book Your Free Practice Audit
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <div className="text-sm" style={{ color: "#3A2D08" }}>
              No contracts. No obligation. Just clarity.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer
      className="relative pt-20 pb-10 border-t"
      style={{ borderColor: C.border, background: C.bg }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: C.accent }}
              >
                <Activity size={16} strokeWidth={2.5} color="#1A1407" />
              </div>
              <span className="font-display text-2xl" style={{ color: C.text }}>
                Pulse <span style={{ color: C.accent }}>Automation</span>
              </span>
            </div>
            <p className="mt-5 text-base max-w-md leading-relaxed" style={{ color: C.textDim }}>
              AI automation for healthcare and dental practices. We build the
              systems that let your team do what they were trained to do.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: C.textMuted }}>
              Navigate
            </div>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {[
                { href: "#services", label: "Services" },
                { href: "#process", label: "Process" },
                { href: "#results", label: "Results" },
                { href: "#pricing", label: "Pricing" },
                { href: "#faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    style={{ color: C.textDim, transition: "color 200ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: C.textMuted }}>
              Contact
            </div>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2" style={{ color: C.textDim }}>
                <Mail size={14} color={C.accent} /> hello@pulseautomation.co
              </li>
              <li className="flex items-center gap-2" style={{ color: C.textDim }}>
                <MapPin size={14} color={C.accent} /> Austin, TX · Remote-first
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "X / Twitter" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.textDim,
                    transition: "all 220ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.accent;
                    e.currentTarget.style.color = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.textDim;
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs"
          style={{ borderTop: `1px solid ${C.border}`, color: C.textMuted }}
        >
          <div>© 2026 Pulse Automation. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <Zap size={12} color={C.accent} />
            HIPAA-aligned · BAA available · SOC 2 in progress
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------- App ----------
export default function PulseAutomation() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = useCallback(() => setBookingOpen(true), []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  return (
    <BookingContext.Provider value={openBooking}>
      <div className="font-body min-h-screen" style={{ background: C.bg, color: C.text }}>
        <GlobalStyles />
        <Nav />
        <main>
          <Hero />
          <PainPoints />
          <Services />
          <Process />
          <Results />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <BookingModal open={bookingOpen} onClose={closeBooking} />
      </div>
    </BookingContext.Provider>
  );
}
