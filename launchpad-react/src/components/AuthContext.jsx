import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

const ACCOUNTS_KEY = "launchpad_known_accounts";

function loadKnownAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveKnownAccounts(list) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [knownAccounts, setKnownAccounts] = useState(loadKnownAccounts);

  function rememberAccount(u) {
    if (!u?.email) return;
    setKnownAccounts((prev) => {
      const rest = prev.filter((a) => a.email !== u.email);
      const next = [
        { email: u.email, fullName: u.user_metadata?.full_name || u.email },
        ...rest,
      ].slice(0, 5);
      saveKnownAccounts(next);
      return next;
    });
  }

  function forgetAccount(email) {
    setKnownAccounts((prev) => {
      const next = prev.filter((a) => a.email !== email);
      saveKnownAccounts(next);
      return next;
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) rememberAccount(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) rememberAccount(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    setUser(data.user);
    if (data.user) rememberAccount(data.user);
    return { user: data.user };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setUser(data.user);
    if (data.user) rememberAccount(data.user);
    return { user: data.user };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function deleteAccount() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: "No active session" };

    const WORKER_URL = "https://launchpad-worker.maryam-ai.workers.dev";

    const res = await fetch(`${WORKER_URL}/delete-account`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: result.error || "Failed to delete account" };
    }

    forgetAccount(session.user.email);
    await supabase.auth.signOut();
    setUser(null);

    return { success: true };
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut, deleteAccount, knownAccounts, forgetAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
