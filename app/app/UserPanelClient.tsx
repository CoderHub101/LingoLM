"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type MeUnauthed = {
  authenticated: false;
};

type MeAuthed = {
  authenticated: true;
  user: {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  rawClaims: Record<string, unknown>;
};

type MeResponse = MeUnauthed | MeAuthed;

export default function UserPanelClient() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/me");
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        const json = (await r.json()) as MeResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading…</p>;
  if (!data.authenticated) return <p>Not signed in.</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <p>Signed in as: {data.user.email || data.user.name || "Unknown user"}</p>

      {data.user.picture ? (
        <Image
          src={data.user.picture}
          alt="avatar"
          width={64}
          height={64}
          style={{ borderRadius: 999 }}
        />
      ) : null}

      <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12, overflowX: "auto" }}>
        {JSON.stringify(data.rawClaims, null, 2)}
      </pre>
    </div>
  );
}
