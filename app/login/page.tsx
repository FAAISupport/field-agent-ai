import { signIn } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const next = typeof params.next === "string" ? params.next : "/portal";

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#07111f", color: "#edf4ff" }}>
      <section style={{ width: "100%", maxWidth: 440, padding: 32, border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, background: "#0b1d31" }}>
        <p style={{ letterSpacing: ".14em", fontSize: 11, fontWeight: 800, color: "#74b7ff" }}>FIELD AGENT AI, LLC</p>
        <h1 style={{ marginBottom: 8 }}>Customer Portal</h1>
        <p style={{ color: "#bfd0e3", marginBottom: 24 }}>Sign in to your company workspace.</p>
        {error ? <p role="alert" style={{ padding: 12, borderRadius: 10, background: "rgba(255,90,90,.12)", color: "#ffd0d0" }}>{error}</p> : null}
        <form action={signIn} style={{ display: "grid", gap: 14 }}>
          <input type="hidden" name="next" value={next} />
          <label style={{ display: "grid", gap: 6 }}>Email<input name="email" type="email" autoComplete="email" required style={{ padding: 12, borderRadius: 10 }} /></label>
          <label style={{ display: "grid", gap: 6 }}>Password<input name="password" type="password" autoComplete="current-password" required style={{ padding: 12, borderRadius: 10 }} /></label>
          <button type="submit" style={{ marginTop: 8, padding: 12, border: 0, borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Sign in</button>
        </form>
      </section>
    </main>
  );
}
