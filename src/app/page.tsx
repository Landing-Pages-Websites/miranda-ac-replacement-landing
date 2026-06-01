"use client";

import { useEffect, useState, useRef } from "react";
import { useTracking } from "@/hooks/useTracking";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { formatPhone, validatePhone } from "@/hooks/usePhoneValidation";

/* ─── Constants ─── */
const PHONE = "(772) 878-5908";
const PHONE_HREF = "tel:+17728785908";

/* ─── Reveal hook (scroll animations) ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Stat counter ─── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (!start || ref.current) return;
    ref.current = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [start, end, duration]);
  return count;
}

function StatCounter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(end, 2000, isVisible);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-white font-[family-name:var(--font-heading)]">{count.toLocaleString()}{suffix}</div>
      <div className="mt-2 text-sm sm:text-base text-white/70 uppercase tracking-wider">{label}</div>
    </div>
  );
}

/* ─── Chevron ─── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ─── FAQ ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button className="w-full flex items-center justify-between py-5 text-left text-lg font-medium font-[family-name:var(--font-heading)] text-dark" onClick={() => setOpen(!open)}>
        <span className="pr-4">{q}</span>
        <Chevron open={open} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Service Card ─── */
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="reveal bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-light/20 transition-all duration-300 group">
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] mb-2 text-dark">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Icons (inline SVG) ─── */
const IconAC = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);
const IconWrench = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
  </svg>
);
const IconDroplet = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 006.363-13.636L12 1.5 5.636 7.364A8.25 8.25 0 0012 21z" />
  </svg>
);
const IconBolt = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);
const IconShield = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const IconFilter = () => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
  </svg>
);

/* ─── Lead Form ─── */
function LeadForm({ id, onSubmit, submitted, submitting }: {
  id: string;
  onSubmit: (data: Record<string, unknown>) => void;
  submitted: boolean;
  submitting: boolean;
}) {
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isHomeowner, setIsHomeowner] = useState<string | null>(null);
  const [homeownerError, setHomeownerError] = useState("");
  const [timeline, setTimeline] = useState("");
  const [timelineError, setTimelineError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  // Local ref guard — prevents double-call from the same render frame even
  // when React hasn't applied `submitting=true` yet.
  const localInFlight = useRef(false);

  const runValidationAndSubmit = () => {
    if (localInFlight.current || submitting || submitted) return;
    const form = formRef.current;
    if (!form) return;

    // Validate phone
    const phoneResult = validatePhone(phoneValue);
    if (!phoneResult.valid) {
      setPhoneError(phoneResult.error);
      return;
    }

    // Validate email
    const emailInput = form.querySelector(`#email-${id}`) as HTMLInputElement;
    if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate homeowner
    if (!isHomeowner) {
      setHomeownerError("Please select an option.");
      return;
    }

    // Validate timeline
    if (!timeline) {
      setTimelineError("Please select a timeline.");
      return;
    }

    const firstName = (form.querySelector(`#firstName-${id}`) as HTMLInputElement)?.value;
    const lastName = (form.querySelector(`#lastName-${id}`) as HTMLInputElement)?.value;
    const email = emailInput?.value;

    // EVERY submission goes to the lead API — qualified AND disqualified
    // (AGENTS Builds Lane Rule 1). Disqualified leads (isHomeowner === "No")
    // are tagged with qualified:false + a reason, never silently dropped.
    const qualified = isHomeowner === "Yes";
    const disqualification_reason = qualified ? null : "not_homeowner";

    localInFlight.current = true;
    onSubmit({
      firstName,
      lastName,
      email,
      phone: phoneValue.replace(/\D/g, ""),
      isHomeowner,
      serviceTimeline: timeline,
      qualified,
      disqualification_reason,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    runValidationAndSubmit();
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-2">Thank You!</h3>
        <p className="text-gray-600">A Miranda Comfort Advisor will reach out shortly to schedule your free in-home estimate.</p>
        <a href={PHONE_HREF} className="inline-block mt-4 text-primary font-semibold hover:underline">
          Want to talk now? Call {PHONE}
        </a>
      </div>
    );
  }

  const inputBase = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-dark text-sm placeholder:text-gray-400 focus:border-primary-light focus:ring-2 focus:ring-primary-light/20 transition-all";

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <input id={`firstName-${id}`} name="firstName" type="text" placeholder="First Name" required autoComplete="given-name" minLength={1} className={inputBase} />
        <input id={`lastName-${id}`} name="lastName" type="text" placeholder="Last Name" required autoComplete="family-name" minLength={1} className={inputBase} />
      </div>
      <input id={`email-${id}`} name="email" type="email" placeholder="Email Address" required pattern="[^\s@]+@[^\s@]+\.[^\s@]+" autoComplete="email" className={inputBase} />
      <div>
        <input
          id={`phone-${id}`}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          pattern="\(\d{3}\)\s\d{3}-\d{4}"
          placeholder="Phone Number"
          required
          className={`${inputBase} ${phoneError ? "border-red-400" : ""}`}
          value={formatPhone(phoneValue)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
            setPhoneValue(raw);
            if (phoneError) setPhoneError("");
          }}
        />
        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
      </div>

      {/* Homeowner toggle */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Are you the homeowner or financially responsible?</p>
        <div className="grid grid-cols-2 gap-3">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="toggle-box cursor-pointer">
              <input
                type="radio"
                name={`isHomeowner-${id}`}
                value={opt}
                checked={isHomeowner === opt}
                onChange={() => { setIsHomeowner(opt); setHomeownerError(""); }}
                className="sr-only"
              />
              <div className={`text-center py-3 rounded-lg border-2 text-sm font-medium transition-all ${isHomeowner === opt ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-600 hover:border-primary-light/40"}`}>
                {opt}
              </div>
            </label>
          ))}
        </div>
        {homeownerError && <p className="text-red-500 text-xs mt-1">{homeownerError}</p>}
      </div>


      {/* Timeline select */}
      <div>
        <div className="relative">
          <select
            name={`serviceTimeline-${id}`}
            value={timeline}
            onChange={(e) => { setTimeline(e.target.value); setTimelineError(""); }}
            className={`${inputBase} appearance-none pr-10 ${!timeline ? "text-gray-400" : "text-dark"} ${timelineError ? "border-red-400" : ""}`}
          >
            <option value="" disabled>How soon are you looking for AC replacement?</option>
            <option value="ASAP">ASAP — my system has failed</option>
            <option value="Within a week">Within a week</option>
            <option value="Within 2-4 weeks">Within 2 – 4 weeks</option>
            <option value="1-3 months">1 – 3 months (planning ahead)</option>
            <option value="Just researching">Just researching options</option>
          </select>
          <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {timelineError && <p className="text-red-500 text-xs mt-1">{timelineError}</p>}
      </div>

      <button
        type="button"
        onClick={runValidationAndSubmit}
        disabled={submitting}
        className="w-full py-4 bg-accent hover:bg-accent-light text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
      >
        {submitting ? "Submitting..." : "Get My Free AC Replacement Quote"}
      </button>
      <p className="text-center text-xs text-gray-400">No obligation. We typically respond within 30 minutes during business hours.</p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MirandaLandingPage() {
  useReveal();
  useTracking({ siteKey: "c1oonazi5u9kxj4e", siteId: "529f83af-a4e3-47ca-9cfc-c68f0388db1e", gtmId: "GTM-NSBW6QX9" });
  const { submit } = useMegaLeadForm();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  // Synchronous ref guard — protects against same-tick rapid clicks where
  // React batches `setSubmitting(true)` and the next click reads the stale `false`.
  const inFlightRef = useRef(false);

  // Show floating CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    // Rapid-click guard: synchronous ref check fires BEFORE the next setState
    // batch is applied, so 5 same-tick clicks now result in exactly 1 event.
    if (inFlightRef.current || submitted) return;
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      await submit(data);
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
      // Do NOT clear inFlightRef on error — we don't want a duplicate submit
      // even after a failure. The user can refresh / call us directly.
    }
  };

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <img src="/images/logo.png" alt="Miranda Plumbing and Air Conditioning" className="h-10 sm:h-14 w-auto" />
          <div className="flex items-center gap-3">
            <a
              href={PHONE_HREF}
              className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {PHONE}
            </a>
            <a
              href="#contact"
              className="bg-accent hover:bg-accent-light text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-300 text-sm"
            >
              Free AC Quote
            </a>
          </div>
        </div>
        {/* Service tabs — page content stays on AC Replacement; tabs point to main site for other services */}
        <nav aria-label="Service navigation" className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 text-xs sm:text-sm font-semibold whitespace-nowrap">
              <li>
                <a href="#hero" className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-white">AC Replacement</a>
              </li>
              <li>
                <a href="https://www.mirandahomeservices.com/ac-repair/" className="inline-flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">AC Repair</a>
              </li>
              <li>
                <a href="https://www.mirandahomeservices.com/ac-maintenance/" className="inline-flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">AC Maintenance</a>
              </li>
              <li>
                <a href="https://www.mirandahomeservices.com/plumbing/" className="inline-flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">Plumbing</a>
              </li>
              <li>
                <a href="https://www.mirandahomeservices.com/water-heaters/" className="inline-flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">Water Heaters</a>
              </li>
              <li>
                <a href="https://www.mirandahomeservices.com/water-filtration/" className="inline-flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors">Water Filtration</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="pt-12">
        {/* ═══ HERO ═══ */}
        <section id="hero" className="relative pt-20 sm:pt-24 bg-gradient-to-br from-primary via-primary to-dark-soft overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: Copy */}
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full border border-white/10">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="5" /></svg>
                  Free in-home Comfort Advisor visit · Treasure Coast since 1981
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold font-[family-name:var(--font-heading)] leading-[1.1] tracking-tight">
                  AC Replacement{" "}<span className="text-blue-300 whitespace-nowrap">on the Treasure&nbsp;Coast</span>
                </h1>
                <p className="text-lg sm:text-xl text-white/80 max-w-lg leading-relaxed">
                  Tired of an aging AC that can&apos;t keep up with Florida summers? Get a <strong className="text-white">free in-home Comfort Advisor visit</strong>, a written quote, and a new Ruud system installed within the week. Financing on approved credit, code-compliant install, and a full manufacturer warranty across Port St. Lucie, Stuart, Jupiter, Palm Beach Gardens &amp; the Treasure Coast.
                </p>

                {/* Install-intent keyword strip */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Full AC System Replacement",
                    "Ruud Pro Partner",
                    "Same-Week Install",
                    "Manual J Sizing",
                    "Financing OAC",
                    "10-Year Warranty",
                  ].map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-3.5 py-1.5 rounded-full border border-white/15 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-4 rounded-lg text-base sm:text-lg transition-all duration-300 border border-white/20 whitespace-nowrap">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call {PHONE}
                  </a>
                  <a href="#contact" className="inline-flex items-center justify-center text-center bg-accent hover:bg-accent-light text-white font-bold px-7 py-4 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/30 whitespace-nowrap">
                    Get My Free AC Replacement Quote
                  </a>
                </div>

                {/* Geographic signals: cities served */}
                <div className="pt-2">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-2 font-semibold">Serving</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Port St. Lucie · Stuart · Jupiter · Palm Beach Gardens · Jensen Beach · Palm City · Hobe Sound · Fort Pierce · Vero Beach
                  </p>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    "Free In-Home Estimate",
                    "Financing on Approved Credit",
                    "Ruud Pro Partner",
                    "Licensed FL CAC1815486",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-white/70 text-sm">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {badge}
                    </div>
                  ))}
                </div>

                {/* Trust strip: Ruud Pro Partner badge */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-md">
                    <img
                      src="/images/ruud-pro-partner.jpg"
                      alt="Ruud Pro Partner — Miranda Plumbing & Air authorized installer"
                      className="h-10 sm:h-12 w-auto"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-white/70 text-sm">Authorized Ruud Pro Partner — every install is factory-warrantied and registered before we leave.</p>
                </div>
              </div>

              {/* Right: Form Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark">Free In-Home AC Quote</h2>
                  <p className="text-gray-500 text-sm mt-1">Tell us about your home — we&apos;ll bring the right-sized quote to your door.</p>
                </div>
                <LeadForm id="hero" onSubmit={handleFormSubmit} submitted={submitted} submitting={submitting} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SIGNS YOU NEED REPLACEMENT (above-the-fold ad-aligned section) ═══ */}
        <section id="signs-you-need-replacement" className="bg-white border-y-4 border-accent/20 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 reveal">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Free In-Home Comfort Advisor Visit
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark leading-tight mb-4">
                  Is It Time to Replace Your AC?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">
                  Most Treasure Coast central AC systems lose capacity at 12 – 15 years. If yours is short-cycling, struggling on humid afternoons, or driving up your FPL bill, replacement usually makes more financial sense than another expensive repair.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our licensed Comfort Advisor comes to your home, runs a Manual J load calculation, looks at your ductwork and insulation, and walks you through what a right-sized Ruud system would cost — installed, warrantied, and tuned. No high-pressure pitch, no surprise add-ons, no obligation. You get a clear written quote and an honest answer on whether replacement or repair is right for your situation, usually the same day. Most replacements scheduled within 3 – 7 days.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#contact" className="inline-flex items-center justify-center bg-accent hover:bg-accent-light text-white font-bold px-6 py-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/30">
                    Get My Free AC Replacement Quote
                  </a>
                  <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-4 rounded-lg text-base transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call {PHONE}
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 reveal">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <img
                    src="/images/miranda-truck.jpg"
                    alt="Miranda Plumbing & Air service truck on the Treasure Coast, fully stocked for same-week AC installation"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-5">7 Signs It&apos;s Time to Replace</h3>
                  <ul className="space-y-3">
                    {[
                      "System is 12+ years old &amp; needs frequent repairs",
                      "FPL bills climbing every month with the same usage",
                      "AC can&apos;t keep up on humid Florida afternoons",
                      "Uses old R-22 refrigerant (banned, expensive to recharge)",
                      "Repair quote is more than 30% of replacement cost",
                      "Loud running, short-cycling, or rust on the outdoor unit",
                      "Uneven cooling — some rooms hot, some freezing",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-gray-700 text-sm">
                        <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section id="stats" className="bg-primary py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter end={45} suffix="+" label="Years of Service" />
              <StatCounter end={1981} suffix="" label="Family-Owned Since" />
              <StatCounter end={5} suffix="★" label="Google Rating" />
              <StatCounter end={0} suffix="$" label="Free In-Home Estimate" />
            </div>
          </div>
        </section>

        {/* ═══ SERVICES ═══ */}
        <section id="systems-we-install" className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 reveal">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">AC Systems We Install</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark">Ruud Replacement Systems Sized for Florida Homes</h2>
              <p className="mt-4 text-gray-500 max-w-3xl mx-auto">Miranda is a Ruud Pro Partner. We install central air, heat pumps, and ductless mini-splits sized correctly for your home with a Manual J load calculation — never an over-sized eyeball quote. Every replacement is code-compliant, permit-pulled when required, and warranty-registered before we leave.</p>
            </div>
            <div className="reveal mb-10 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img
                src="/images/ac-system-install.jpg"
                alt="Miranda Plumbing & Air installer working on a Ruud central AC condenser at a Treasure Coast home"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              <ServiceCard icon={<IconAC />} title="Central AC Replacement" description="Full central AC system swap-out — condenser, air handler, line set, and thermostat. Ruud Achiever and Endeavor series in SEER2 14.3 – 20+ for serious efficiency gains." />
              <ServiceCard icon={<IconBolt />} title="Heat Pump Replacement" description="Energy-efficient heat pump systems for year-round comfort — cooling in summer, supplemental heat on the rare Treasure Coast cold snap. Single-stage and variable-speed options." />
              <ServiceCard icon={<IconFilter />} title="Ductless Mini-Split Install" description="Perfect for additions, sunrooms, garages, or homes without ductwork. Quiet, zone-controlled cooling with individual room temperature settings and no major demolition." />
              <ServiceCard icon={<IconShield />} title="High-Efficiency Upgrades" description="Variable-speed compressors, two-stage cooling, and smart thermostats that drop your FPL bill 20-40% vs an aging single-stage system. ROI usually 5 – 8 years." />
              <ServiceCard icon={<IconWrench />} title="Ductwork Inspection & Repair" description="Leaky ducts can waste 20 – 30% of your AC output. We inspect, seal, and replace damaged duct runs during install so your new system delivers what you paid for." />
              <ServiceCard icon={<IconDroplet />} title="Smart Thermostat Integration" description="Wi-Fi smart thermostats (Ecobee, Honeywell, Nest) installed and configured with your new system. App control, scheduling, and FPL energy-saver program enrollment." />
            </div>
            <div className="text-center mt-10 reveal">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold px-6 py-4 rounded-lg text-base transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  Call {PHONE}
                </a>
                <a href="#contact" className="inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105">
                  Get My Free AC Replacement Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ AC INSTALLATION DEEP DIVE ═══ */}
        <section id="ac-installation" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="reveal">
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">New AC Installation &amp; Replacement</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-5">A New AC System, Sized Right for Your Florida Home</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Most Treasure Coast homes lose AC capacity at 12 – 15 years. If your system is short-cycling, struggling on humid afternoons, or driving up your FPL bill, replacement usually makes more sense than another expensive repair. Our Comfort Advisor visits your home, runs a Manual J load calculation, and recommends a Ruud system sized for your square footage, ductwork, and insulation.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We don&apos;t do high-pressure quotes. You get a clear, written estimate with options, financing terms, and an installation timeline. Most replacements happen <strong>within 3 – 7 days</strong> of approval. Old system removed and recycled, new system installed code-compliant, refrigerant charged correctly, thermostat calibrated, and warranty paperwork registered before we leave.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold px-6 py-4 rounded-lg text-base transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    Call {PHONE}
                  </a>
                  <a href="#contact" className="inline-flex items-center justify-center bg-accent hover:bg-accent-light text-white font-bold px-7 py-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/25">
                    Schedule My Free Comfort Advisor Visit
                  </a>
                </div>
              </div>
              <div className="reveal">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-5">What&apos;s included with every install</h3>
                  <ul className="space-y-3.5">
                    {[
                      "Free in-home Comfort Advisor visit & Manual J load calc",
                      "Written, all-in quote — no surprise add-ons",
                      "Right-sized Ruud central AC, mini-split, or heat pump",
                      "Old system removal, recycling & refrigerant recovery",
                      "Code-compliant install with permit pulled when required",
                      "New thermostat, warranty registration & system tuning",
                      "Financing on approved credit (GreenSky)",
                      "1-year labor warranty + manufacturer parts warranty",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ═══ WHY MIRANDA ═══ */}
        <section id="about" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="reveal">
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
                <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6">
                  The Treasure Coast Has Trusted Miranda for AC Replacement Since 1981
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Miranda Plumbing &amp; Air has been the go-to AC installer for homeowners across Port St. Lucie, Stuart, Jupiter, and Palm Beach Gardens for over 45 years. We&apos;re fully licensed (FL CAC1815486), family-owned, and we install every system the way we&apos;d install it in our own homes — sized correctly with a Manual J load calc, code-compliant, permit-pulled when required, and fully warrantied before we leave the driveway.
                </p>
                <div className="space-y-4">
                  {[
                    { title: "Free In-Home Comfort Advisor Visit", desc: "We measure, listen, and design — not pitch. Manual J load calc and written quote, no obligation." },
                    { title: "Same-Week Installation", desc: "Most replacements scheduled within 3 – 7 days. Old system removed, new system installed and tuned the same day." },
                    { title: "Financing on Approved Credit", desc: "GreenSky financing with flexible terms. Get a new system installed now, pay over time." },
                    { title: "Ruud Pro Partner + Warranty", desc: "Top-tier Ruud equipment, 1-year labor warranty, and full manufacturer parts warranty registered before we leave." },
                    { title: "Licensed FL CFC1427227 & CAC1815486", desc: "45+ years on the Treasure Coast. Permit pulled when required, inspections handled, paperwork done right." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold font-[family-name:var(--font-heading)] text-dark">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right column: trust image / credentials card */}
              <div className="reveal">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <img
                    src="/images/comfort-advisor.jpg"
                    alt="Miranda Plumbing & Air technician arriving for an in-home Comfort Advisor visit on the Treasure Coast"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-6 bg-gradient-to-br from-primary to-dark-soft rounded-2xl p-8 sm:p-10 text-white">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-6">Your New AC, Done Right</h3>
                  <div className="space-y-5">
                    {[
                      { num: "45+", label: "Years installing on the Treasure Coast" },
                      { num: "$0", label: "For your in-home Comfort Advisor visit" },
                      { num: "5★", label: "Google-rated installation experience" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                        <span className="text-3xl font-bold font-[family-name:var(--font-heading)] text-blue-300 w-20 shrink-0">{stat.num}</span>
                        <span className="text-white/80">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                  <a href="#contact" className="mt-8 inline-flex items-center justify-center w-full bg-accent hover:bg-accent-light text-white font-bold py-4 rounded-lg transition-all duration-300 text-lg">
                    Schedule My Free Comfort Advisor Visit
                  </a>
                  <p className="text-center mt-3 text-white/60 text-sm">Or call <a href={PHONE_HREF} className="text-blue-300 hover:underline">{PHONE}</a></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 reveal">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">A No-Pressure Install Process</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark">From First Call to Installed System in 3 Steps</h2>
            </div>
            <div className="reveal mb-12 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img
                src="/images/miranda-tech.jpg"
                alt="Miranda Plumbing & Air technician completing a new central AC installation in Port St. Lucie"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-8 stagger">
              {[
                { step: "1", title: "Free Comfort Advisor Visit", desc: "We come to your home, measure, run a Manual J load calc, and listen to what you actually need. No pressure, no scripted pitch." },
                { step: "2", title: "Written, All-In Quote", desc: "You get a clear written quote with system options, financing terms, and an installation date — usually within 3 – 7 days." },
                { step: "3", title: "Same-Week Install", desc: "Old system removed and recycled. New system installed code-compliant, tuned, registered for warranty, and demoed before we leave." },
              ].map((item) => (
                <div key={item.step} className="reveal text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-[family-name:var(--font-heading)]">{item.step}</div>
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-dark mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 reveal">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold px-6 py-4 rounded-lg text-base transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  Call {PHONE}
                </a>
                <a href="#contact" className="inline-flex items-center justify-center bg-accent hover:bg-accent-light text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105">
                  Schedule My Free Comfort Advisor Visit
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section id="testimonials" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 reveal">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Real Install Reviews</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark">What Treasure Coast Homeowners Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 stagger">
              {[
                { name: "John Conti", text: "Always prompt and reliable. Great tech!", rating: 5, source: "Google" },
                { name: "Bette Goodwin", text: "Tim did a great job. Very personable, professional, knowledgeable, thorough and super friendly. Did an outstanding job. Thank you Miranda for having an awesome tech.", rating: 5, source: "Google" },
                { name: "Michael Groves", text: "Miranda is always very thorough and professional. Highly recommend from office personnel to techs in the field.", rating: 5, source: "Google" },
              ].map((review) => (
                <div key={review.name} className="reveal bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                  <p className="font-semibold text-dark">{review.name}</p>
                  <p className="text-sm text-gray-400">Verified {review.source} review</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SERVICE AREA ═══ */}
        <section id="location" className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="reveal">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Service Area</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">Installing Across Florida&apos;s Treasure Coast</h2>
              <p className="text-gray-500 max-w-2xl mx-auto mb-8">Free in-home Comfort Advisor visits and licensed installation throughout the region, including:</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger max-w-3xl mx-auto">
              {["Port St. Lucie", "Stuart", "Jupiter", "Palm Beach Gardens", "Jensen Beach", "Palm City", "Hobe Sound", "Fort Pierce", "Vero Beach", "Sebastian", "Tequesta", "Hutchinson Island"].map((city) => (
                <div key={city} className="reveal bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
                  {city}
                </div>
              ))}
            </div>
            <div className="mt-10 reveal">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary border-2 border-primary font-bold px-6 py-4 rounded-lg text-base transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  Call {PHONE}
                </a>
                <a href="#contact" className="inline-flex items-center justify-center bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105">
                  Schedule a Visit in Your Area
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="py-16 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 reveal">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Installation FAQs</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark">Common Questions Before You Replace</h2>
            </div>
            <div className="reveal">
              <FAQItem q="How much does a new AC system cost?" a="Most full Treasure Coast central AC replacements run $6,500 – $14,000 depending on home size, ductwork condition, and equipment tier (SEER2 rating, single vs variable speed). Your written quote includes equipment, labor, permit, removal of the old unit, and warranty registration. Financing on approved credit makes monthly payments very manageable." />
              <FAQItem q="How long does a Comfort Advisor visit take?" a="Plan on 45 – 60 minutes. We measure your home, run a Manual J load calculation, look at ductwork and the existing unit, and discuss your goals — efficiency, quietness, allergy control, or just getting cool air back fast. You get a written, all-in quote, usually the same day." />
              <FAQItem q="How fast can you install a new AC system?" a="Most AC replacements happen within 3 – 7 days of approving the quote. Equipment we stock locally can sometimes go in next-day. We schedule the install around your calendar — early morning, after school drop-off, or weekends when needed. Standard installs take a full day; complex projects with ductwork repair can run two days." />
              <FAQItem q="Do you offer financing?" a="Yes. We offer GreenSky financing on approved credit with flexible terms. Most homeowners qualify for low-monthly-payment options that let them install a higher-tier system today and pay over time, instead of pouring money into another expensive repair on a dying unit." />
              <FAQItem q="What AC brands do you install?" a="We're a Ruud Pro Partner — Ruud Achiever, Endeavor, and Ultra series central AC, heat pumps, and variable-speed systems. We also install Mitsubishi ductless mini-splits and integrate Ecobee, Honeywell, and Nest smart thermostats. Every install includes the manufacturer parts warranty registered before we leave, plus our 1-year labor warranty." />
              <FAQItem q="Are your installers licensed?" a="Yes. Miranda holds Florida licenses CFC1427227 (plumbing) and CAC1815486 (HVAC). Every installer is fully insured, attends weekly training, and pulls the proper permits when required by your municipality." />
              <FAQItem q="What areas do you install in?" a="We install AC replacement systems across the full Treasure Coast and northern Palm Beach County: Port St. Lucie, Stuart, Jupiter, Palm Beach Gardens, Jensen Beach, Palm City, Hobe Sound, Fort Pierce, Vero Beach, Sebastian, Tequesta, and Hutchinson Island." />
              <FAQItem q="Will a new system actually lower my FPL bill?" a="In most cases, yes — significantly. A modern variable-speed Ruud system with SEER2 16 – 20 can drop the cooling portion of your FPL bill 20 – 40% versus an aging 10-SEER single-stage unit. Combined with proper sizing, sealed ducts, and a smart thermostat, the new system often pays for itself in 5 – 8 years and runs quieter and more reliably the whole time." />
              <FAQItem q="Repair or replace — how do I decide?" a="Two rules of thumb: (1) if your system is 12+ years old AND the repair quote is more than 30% of replacement cost, replacement almost always wins. (2) if your system still uses R-22 refrigerant (phased out in 2020), parts and recharges are getting expensive and replacement is the smarter long-term move. Our Comfort Advisor gives you an honest answer either way — we run repair quotes too." />
            </div>
          </div>
        </section>

        {/* ═══ CONTACT / FINAL CTA ═══ */}
        <section id="contact" className="py-16 sm:py-24 bg-gradient-to-br from-primary via-primary to-dark-soft">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-white">Ready for a New System?</h2>
              <p className="mt-3 text-white/70 text-lg">Schedule your free in-home Comfort Advisor visit. We typically respond within 30 minutes during business hours.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 reveal">
              <LeadForm id="contact" onSubmit={handleFormSubmit} submitted={submitted} submitting={submitting} />
            </div>
            <div className="text-center mt-6 reveal">
              <p className="text-white/70">Prefer to talk? Call us directly:</p>
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 mt-2 text-white text-2xl font-bold hover:text-blue-300 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-dark py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Miranda Plumbing &amp; Air Conditioning. All rights reserved.</p>
        <p className="mt-1 text-gray-600">FL License CFC1427227 &amp; CAC1815486</p>
      </footer>

      {/* ═══ FLOATING CTA ═══ */}
      {showFloating && (
        <div className="fixed bottom-6 right-6 z-50 float-enter">
          <a
            href="#contact"
            className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-bold px-6 py-3.5 rounded-full shadow-xl shadow-accent/30 transition-all duration-300 transform hover:scale-105 text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Free Install Estimate
          </a>
        </div>
      )}
    </>
  );
}
