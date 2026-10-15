import { useEffect, useState, type FormEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Alert, Button, Checkbox, Input } from "@kaistrum/stratum-ui";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import {
	EyeIcon,
	EyeOffIcon,
	LockIcon,
	MailIcon
} from "@/components/icons";

/** Decorative map/corridor motif drawn on the brand panel. */
function CorridorArt() {
	return (
		<svg
			viewBox="0 0 420 320"
			fill="none"
			aria-hidden="true"
			className="h-auto w-full max-w-md text-text-on-accent">
			{/* soft route halo */}
			<path
				d="M30 250 C 120 250, 110 120, 200 120 S 300 70, 390 70"
				stroke="currentColor"
				strokeOpacity="0.18"
				strokeWidth="16"
				strokeLinecap="round"
			/>
			{/* main corridor */}
			<path
				d="M30 250 C 120 250, 110 120, 200 120 S 300 70, 390 70"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeDasharray="1 10"
				strokeOpacity="0.9"
			/>
			{/* waypoints */}
			{[
				[30, 250],
				[200, 120],
				[390, 70]
			].map(([cx, cy]) => (
				<g key={`${cx}-${cy}`}>
					<circle
						cx={cx}
						cy={cy}
						r="7"
						fill="currentColor"
						fillOpacity="0.18"
					/>
					<circle cx={cx} cy={cy} r="3.5" fill="currentColor" />
				</g>
			))}
			{/* live, guarded node */}
			<g>
				<circle
					cx="200"
					cy="120"
					r="10"
					fill="currentColor"
					fillOpacity="0.5"
					className="ping-ripple"
				/>
				<circle cx="200" cy="120" r="4.5" fill="currentColor" />
			</g>
		</svg>
	);
}

export default function LoginPage() {
	const { user, ready, login } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// Already signed in → skip the login screen.
	useEffect(() => {
		if (ready && user) router.replace("/dashboard");
	}, [ready, user, router]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!email.trim() || !password) {
			setError("Enter your email and password to continue.");
			return;
		}
		setSubmitting(true);
		try {
			await login(email.trim(), password);
			router.replace("/dashboard");
		} catch {
			setError("Something went wrong signing you in. Please try again.");
			setSubmitting(false);
		}
	};

	return (
		<>
			<Head>
				<title>Sign in · Corridor Guard</title>
			</Head>
			<main className="grid min-h-screen bg-bg text-text lg:grid-cols-2">
				{/* ── Brand showcase panel ── */}
				<aside className="relative hidden flex-col justify-between overflow-hidden bg-accent px-12 py-12 text-text-on-accent lg:flex">
					{/* grid + depth overlays */}
					<svg
						className="map-grid pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
						aria-hidden="true">
						<defs>
							<pattern
								id="loginGrid"
								width="34"
								height="34"
								patternUnits="userSpaceOnUse">
								<path
									d="M34 0H0V34"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#loginGrid)" />
					</svg>
					<div
						className="pointer-events-none absolute inset-0"
						style={{
							background:
								"radial-gradient(120% 120% at 20% 10%, transparent 40%, rgba(0,0,0,0.28) 100%)"
						}}
					/>

					{/* wordmark */}
					<div className="relative flex items-center gap-2.5 text-[2.3rem] tracking-tight">
						<span>
							<span className="font-bold">corridor</span>
							<span className="font-light opacity-80">guard</span>
						</span>
					</div>

					{/* centrepiece */}
					<div className="relative flex flex-col items-start gap-8">
						<CorridorArt />
						<div>
							<h2 className="max-w-md font-serif text-4xl leading-tight tracking-tight">
								Catch encroachment in your wayleave corridors.
							</h2>
							<p className="mt-3 max-w-sm text-text-on-accent/80">
								Generate an API key and stream live encroachment detections for
								your utility wayleaves straight into QGIS and ArcGIS Pro.
							</p>
						</div>
					</div>

					{/* trust row */}
					<div className="relative flex flex-wrap gap-x-8 gap-y-2 text-sm text-text-on-accent/80">
						<span>12,000+ km monitored</span>
						<span aria-hidden className="opacity-40">
							•
						</span>
						<span>99.9% uptime</span>
						<span aria-hidden className="opacity-40">
							•
						</span>
						<span>GeoJSON · WFS · MVT</span>
					</div>
				</aside>

				{/* ── Form panel ── */}
				<div className="flex items-center justify-center px-5 py-10 sm:px-8">
					<div className="w-full max-w-sm">
						{/* logo shows here only when the brand panel is hidden */}
						<div className="mb-8 flex justify-center lg:hidden">
							<Logo />
						</div>

						<div className="mb-7">
							<h1 className="font-serif text-3xl tracking-tight">
								Welcome back
							</h1>
							<p className="mt-1.5 text-sm text-text-dim">
								Sign in to your Corridor Guard API center.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							{error && (
								<Alert variant="danger" title="Unable to sign in">
									{error}
								</Alert>
							)}

							<Input
								label="Email"
								type="email"
								autoComplete="email"
								placeholder="you@company.com"
								leadingIcon={<MailIcon width={18} height={18} />}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								label="Password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="••••••••"
								leadingIcon={<LockIcon width={18} height={18} />}
								trailingIcon={
									<button
										type="button"
										onClick={() => setShowPassword((v) => !v)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										className="flex items-center text-text-dim transition-colors hover:text-text">
										{showPassword ? (
											<EyeOffIcon width={18} height={18} />
										) : (
											<EyeIcon width={18} height={18} />
										)}
									</button>
								}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<div className="flex items-center justify-between">
								<Checkbox label="Remember me" defaultChecked />
								<button
									type="button"
									className="text-sm font-medium text-accent hover:underline">
									Forgot password?
								</button>
							</div>

							<Button
								type="submit"
								variant="primary"
								fullWidth
								loading={submitting}
								className="mt-1">
								Sign in
							</Button>
						</form>

						<p className="mt-6 text-center text-sm text-text-dim">
							New to Corridor Guard?{" "}
							<button
								type="button"
								className="font-medium text-accent hover:underline">
								Create an account
							</button>
						</p>

						<p className="mt-6 text-center text-xs text-text-muted">
							Demo environment — any email and password will sign you in.
						</p>
					</div>
				</div>
			</main>
		</>
	);
}
