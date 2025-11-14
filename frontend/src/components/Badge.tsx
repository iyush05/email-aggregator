export function Badge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Interested: "bg-green-100 text-green-800",
    "Meeting Booked": "bg-blue-100 text-blue-800",
    "Not Interested": "bg-gray-200 text-gray-700",
    Spam: "bg-red-100 text-red-800",
    "Out of Office": "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[label] || "bg-gray-100 text-gray-800"
      }`}
    >
      {label}
    </span>
  );
}
