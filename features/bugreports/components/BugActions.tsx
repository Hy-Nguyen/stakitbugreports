import { useBugContext } from '../provider/BugDashboardContext';
import { Bug, BugStatus } from '../type';
import { Edit2, CheckCircle, RotateCcw, Loader2 } from 'lucide-react';

interface BugActionsProps {
  bug: Bug;
  onStatusChange: (bug: Bug, status: BugStatus) => void;
  onEdit: (bug: Bug) => void;
}

export default function BugActions({ bug, onStatusChange, onEdit }: BugActionsProps) {
  const { isUpdatingStatus } = useBugContext();

  return (
    <div className="flex items-center gap-2">
      {bug.status !== 'resolved' && (
        <button
          onClick={() => onEdit(bug)}
          disabled={isUpdatingStatus}
          className="rounded-full p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
          title="Edit bug report"
        >
          <Edit2 size={18} />
        </button>
      )}

      {bug.status !== 'resolved' ? (
        <button
          onClick={() => onStatusChange(bug, 'resolved')}
          disabled={isUpdatingStatus}
          className="rounded-full p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
          title="Mark as resolved"
        >
          {isUpdatingStatus ? <Loader2 size={18} className="animate-spin text-green-600" /> : <CheckCircle size={18} />}
        </button>
      ) : (
        <button
          onClick={() => onStatusChange(bug, 'open')}
          disabled={isUpdatingStatus}
          className="rounded-full p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50"
          title="Reopen bug"
        >
          {isUpdatingStatus ? <Loader2 size={18} className="animate-spin text-yellow-600" /> : <RotateCcw size={18} />}
        </button>
      )}
    </div>
  );
}
