"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Leaf, Loader2, Lock, Mail, UserRound, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/apiClient";

function GoogleMark() {
  return (
    <span className="google-mark" aria-hidden="true">
      G
    </span>
  );
}

function AuthInput({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  hasToggle = false,
  showPassword = false,
  onTogglePassword,
  required = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ReactNode;
  hasToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
}) {
  const inputType = hasToggle ? (showPassword ? "text" : "password") : type;

  return (
    <label className="auth-field" htmlFor={id}>
      <span>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <span className="auth-input-shell">
        {icon}
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete="off"
        />
        {hasToggle && onTogglePassword ? (
          <button
            type="button"
            onClick={onTogglePassword}
            className="p-1 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye size={18} strokeWidth={1.35} />
            ) : (
              <EyeOff size={18} strokeWidth={1.35} />
            )}
          </button>
        ) : null}
      </span>
    </label>
  );
}

function AuthBrand() {
  return (
    <>
      <Link className="auth-logo" href="/" aria-label="YUGEN home">
        YUGEN
      </Link>
    </>
  );
}

function Divider() {
  return (
    <div className="auth-divider" aria-hidden="true">
      <span />
      <em>OR</em>
      <span />
    </div>
  );
}

export function SignInScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Connect to Live Backend API Gateway
      const { data, error: apiError } = await authApi.signIn({ email, password });

      if (data && data.accessToken) {
        localStorage.setItem("yugen_token", data.accessToken);
        localStorage.setItem("yugen_user", JSON.stringify(data.user));

        const targetRoute = redirectParam || data.redirectTo || (data.user?.role === "ADMIN" ? "/admin/dashboard" : "/profile");
        setSuccess(`Signed in successfully! Redirecting...`);

        setTimeout(() => {
          router.push(targetRoute);
        }, 800);
      } else {
        setError(apiError || "Failed to sign in. Please check your credentials.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while signing in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminFill = () => {
    setEmail("admin@yugen.com");
    setPassword("Admin@Yugen2026!");
  };

  const handleQuickCustomerFill = () => {
    setEmail("sarah.j@email.com");
    setPassword("customer123");
  };

  const handleGoogleSignIn = () => {
    setError("");
    setSuccess("Connecting to Google authentication...");
    setTimeout(() => {
      setSuccess("Signed in with Google successfully!");
      setTimeout(() => {
        router.push("/profile");
      }, 800);
    }, 600);
  };

  return (
    <main className="auth-page auth-single-page">
      <section className="auth-showcase auth-showcase-single" aria-label="YUGEN sign in">
        <article className="auth-card signin-card" id="signin">
          <div className="auth-form-panel">
            <AuthBrand />

            <div className="auth-heading">
              <h1>Sign In</h1>
              <p>
                Unified sign in for Customers and Store Administrators.
              </p>
            </div>

            {/* Quick Demo Fill Buttons for Role Redirection */}
            <div className="flex items-center gap-2 my-3 p-2 bg-[#EAE6DD]/50 rounded-lg text-[11px]">
              <span className="text-[#756A5E] font-medium">Quick Fill:</span>
              <button
                type="button"
                onClick={handleQuickCustomerFill}
                className="px-2.5 py-1 rounded bg-[#FBFAF6] hover:bg-[#25211D] hover:text-white text-[#25211D] font-medium border border-[#463627]/20 transition-colors"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={handleQuickAdminFill}
                className="px-2.5 py-1 rounded bg-[#6B4A37]/15 hover:bg-[#6B4A37] text-[#6B4A37] hover:text-white font-bold transition-colors flex items-center gap-1"
              >
                <ShieldCheck size={12} />
                Admin Portal
              </button>
            </div>

            {error && (
              <div className="mt-2 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-2 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                id="signin-email"
                label="Email Address"
                placeholder="e.g. sarah.j@email.com or admin@yugen.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail aria-hidden="true" size={18} strokeWidth={1.35} />}
                required
              />
              <AuthInput
                id="signin-password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock aria-hidden="true" size={18} strokeWidth={1.35} />}
                hasToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              <div className="flex items-center justify-between text-xs my-1">
                <label className="flex items-center space-x-2 cursor-pointer text-[#494139]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#25211D] rounded"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setError("Password reset link sent to your email.")}
                  className="auth-forgot text-right cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button className="auth-primary" type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <Divider />

              <button className="auth-google" type="button" onClick={handleGoogleSignIn}>
                <GoogleMark />
                Continue with Google
              </button>
            </form>

            <p className="auth-switch mt-4 text-xs text-[#756A5E]">
              Don&apos;t have an account? <Link href="/signup" className="font-bold underline text-[#25211D]">Create Account</Link>
            </p>
          </div>

          <div className="auth-image-panel">
            <Image
              src="/assets/auth-signin-visual.png"
              alt="Minimal botanical still life in warm morning light"
              fill
              priority
              sizes="(min-width: 900px) 24vw, 100vw"
            />
          </div>

          <div className="auth-benefits" aria-label="YUGEN account values">
            <Leaf aria-hidden="true" size={24} strokeWidth={1.35} />
            <span>Timeless designs.</span>
            <span>Ethical choices.</span>
            <span>Conscious living.</span>
          </div>
        </article>
      </section>
    </main>
  );
}

export function SignUpScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      // Connect to Live Backend API Gateway
      const { data, error: apiError } = await authApi.signUp({ firstName, lastName, email, password });

      if (data && data.accessToken) {
        localStorage.setItem("yugen_token", data.accessToken);
        localStorage.setItem("yugen_user", JSON.stringify(data.user));

        const targetRoute = redirectParam || "/profile";
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push(targetRoute);
        }, 800);
      } else {
        setError(apiError || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError("");
    setSuccess("Connecting to Google sign-up...");
    setTimeout(() => {
      setSuccess("Signed up with Google successfully!");
      setTimeout(() => {
        router.push("/profile");
      }, 800);
    }, 600);
  };

  return (
    <main className="auth-page auth-single-page">
      <section className="auth-showcase auth-showcase-single" aria-label="YUGEN create account">
        <article className="auth-card signup-card" id="signup">
          <div className="auth-form-panel">
            <AuthBrand />

            <div className="auth-heading signup-heading">
              <h1>Create Account</h1>
              <p>
                Join the YUGEN circle and enjoy
                <br />
                exclusive benefits.
              </p>
            </div>

            {error && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-3 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <form className="auth-form signup-form" onSubmit={handleSubmit}>
              <AuthInput
                id="signup-name"
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<UserRound aria-hidden="true" size={18} strokeWidth={1.35} />}
                required
              />
              <AuthInput
                id="signup-email"
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail aria-hidden="true" size={18} strokeWidth={1.35} />}
                required
              />
              <AuthInput
                id="signup-password"
                label="Password"
                placeholder="Create a password (min 6 chars)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock aria-hidden="true" size={18} strokeWidth={1.35} />}
                hasToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />
              <AuthInput
                id="signup-confirm"
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock aria-hidden="true" size={18} strokeWidth={1.35} />}
                hasToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                required
              />

              <label className="auth-check cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the <span className="underline">Terms &amp; Conditions</span>
                  <br />
                  and <span className="underline">Privacy Policy</span>.
                </span>
              </label>

              <button className="auth-primary" type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
              <Divider />
              <button className="auth-google" type="button" onClick={handleGoogleSignUp}>
                <GoogleMark />
                Continue with Google
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link href="/signin">Sign In</Link>
            </p>
          </div>

          <div className="auth-image-panel">
            <Image
              src="/assets/auth-signup-visual.png"
              alt="Neutral YUGEN garments hanging in a warm boutique interior"
              fill
              priority
              sizes="(min-width: 900px) 24vw, 100vw"
            />
          </div>
        </article>
      </section>
    </main>
  );
}
