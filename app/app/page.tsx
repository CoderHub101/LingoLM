import UserPanelClient from "./UserPanelClient";

export default async function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Cognito + Google Login</h1>
      <p>
        <a href="/api/auth/login">Sign in with Google</a>
        {" · "}
        <a href="/api/auth/logout">Logout</a>
      </p>

      <UserPanel />
    </main>
  );
}

function UserPanel() {
  return <UserPanelClient />;
}
