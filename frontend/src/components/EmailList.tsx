import { Badge } from "./Badge";

export function EmailList({ emails }: { emails: any[] }) {
  if (!emails.length) {
    return <p className="text-gray-500 mt-10">No emails found.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <ul className="divide-y divide-gray-200">
        {emails.map((email) => (
          <li key={email.id} className="py-4 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">
                {email.subject || "(No Subject)"}
              </h3>
              {email.label && <Badge label={email.label} />}
            </div>

            <p className="text-sm text-gray-600">
              From: {email.from} — {new Date(email.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 line-clamp-2">{email.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
