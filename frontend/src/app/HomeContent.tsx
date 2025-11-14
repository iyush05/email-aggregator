"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchEmails, startImapConnection } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { EmailList } from "@/components/EmailList";
import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";

export default function HomeContent() {
  const [emails, setEmails] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    accountId: "",
    folder: "",
    label: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const loadEmails = useCallback(async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEmails({
        q: query,
        accountId: filters.accountId,
        email: email,
        folder: filters.folder,
        label: filters.label,
      });
      setEmails(data || []);
    } catch (err) {
      console.error("Error fetching emails:", err);
      setError("Failed to load emails. Please try again.");
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  }, [email, query, filters]);

  useEffect(() => {
    if (!email || !token) return;

    const connect = async () => {
      setIsConnecting(true);
      setError(null);

      try {
        await startImapConnection({
          id: "gmail1",
          host: "imap.gmail.com",
          port: 993,
          secure: true,
          user: email,
          accessToken: token,
          method: "XOAUTH2",
        });
        setIsConnected(true);
      } catch (err) {
        console.error("Error connecting to IMAP:", err);
        setError("Failed to connect to email server. Please check your credentials.");
      } finally {
        setIsConnecting(false);
      }
    };

    connect();
  }, [email, token]);

  useEffect(() => {
    if (isConnected) {
      loadEmails();
    }
  }, [isConnected, loadEmails]);

  if (!email || !token) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">📨 Email Onebox</h1>
          <p className="text-gray-600">Please provide email and token parameters.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">📨 Email Onebox</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isConnecting && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          Connecting to email server...
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar value={query} onChange={setQuery} />
        <Filters value={filters} onChange={setFilters} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading emails...</div>
        </div>
      ) : (
        <EmailList emails={emails} />
      )}
    </main>
  );
}
