interface FiltersProps {
  value: { accountId: string; folder: string; label: string };
  onChange: (v: { accountId: string; folder: string; label: string }) => void;
}

export function Filters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={value.accountId}
        onChange={(e) => onChange({ ...value, accountId: e.target.value })}
        className="p-2 border rounded-lg"
      >
        <option value="">All Accounts</option>
        <option value="gmail1">Gmail</option>
        <option value="outlook1">Outlook</option>
      </select>

      <select
        value={value.folder}
        onChange={(e) => onChange({ ...value, folder: e.target.value })}
        className="p-2 border rounded-lg"
      >
        <option value="">All Folders</option>
        <option value="INBOX">Inbox</option>
        <option value="SENT">Sent</option>
      </select>

      <select
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value })}
        className="p-2 border rounded-lg"
      >
        <option value="">All Labels</option>
        <option value="Interested">Interested</option>
        <option value="Meeting Booked">Meeting Booked</option>
        <option value="Not Interested">Not Interested</option>
        <option value="Spam">Spam</option>
        <option value="Out of Office">Out of Office</option>
      </select>
    </div>
  );
}
