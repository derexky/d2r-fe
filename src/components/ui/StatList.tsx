interface StatEntry {
  label: string;
  color?: string;
}

interface Props {
  stats: string; // JSON string
}

export default function StatList({ stats }: Props) {
  let entries: StatEntry[] = [];
  try {
    entries = JSON.parse(stats);
  } catch {
    return <span className="text-gray-400 text-xs">{stats}</span>;
  }

  return (
    <div className="text-sm leading-snug">
      {entries.map((e, i) => (
        <span key={i} style={{ color: e.color || '#ffffff' }}>
          {e.label}{' '}
        </span>
      ))}
    </div>
  );
}
