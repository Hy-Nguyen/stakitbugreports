import { Bug, BugStatus } from '../type';
import { ExternalLink, Maximize2 } from 'lucide-react';
import BugActions from './BugActions';
import { useState, useEffect } from 'react';
import BugDetailsModal from './BugDetailsModal';
import BugListSkeleton from './BugListSkeleton';
import { useBugContext } from '../provider/BugDashboardContext';

interface BugListProps {
  bugs: Bug[];
  onStatusChange: (bug: Bug, status: BugStatus) => void;
  onEdit: (bug: Bug) => void;
}

export default function BugList({ bugs, onStatusChange, onEdit }: BugListProps) {
  const { isLoading } = useBugContext();

  const [activeTab, setActiveTab] = useState<'open' | 'resolved'>('open');
  const [prevCategory, setPrevCategory] = useState<string>('');
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  // Only reset to open tab when category changes
  useEffect(() => {
    const currentCategory = bugs[0]?.category || '';
    if (prevCategory && prevCategory !== currentCategory) {
      setActiveTab('open');
    }
    setPrevCategory(currentCategory);
  }, [bugs, prevCategory]);

  const openBugs = bugs.filter((bug) => bug.status !== 'resolved');
  const resolvedBugs = bugs.filter((bug) => bug.status === 'resolved');

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        <button
          onClick={() => setActiveTab('open')}
          className={`whitespace-nowrap px-4 py-3 text-sm font-medium lg:px-6 ${
            activeTab === 'open' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Open Bugs ({openBugs.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`whitespace-nowrap px-4 py-3 text-sm font-medium lg:px-6 ${
            activeTab === 'resolved' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Resolved ({resolvedBugs.length ?? 0})
        </button>
      </div>

      {/* Bug List */}
      {isLoading ? (
        <BugListSkeleton />
      ) : (
        <div className="grid gap-6">
          {(activeTab === 'open' ? openBugs : resolvedBugs).length === 0 ? (
            <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow lg:p-6">
              <p className="text-gray-500">No bugs reported</p>
            </div>
          ) : (
            (activeTab === 'open' ? openBugs : resolvedBugs).map((bug) => (
              <div key={bug.id} className="rounded-lg bg-white p-4 shadow lg:p-6">
                <div className="mb-4 flex items-start justify-between lg:mb-0">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">{bug.title}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-sm ${
                          bug.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : bug.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {bug.status.charAt(0).toUpperCase() + bug.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-sm text-gray-500">By: {bug.author}</h3>
                    <a
                      href={bug.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 break-all text-sm text-blue-600 hover:text-blue-800 lg:text-base"
                    >
                      {bug.url} <ExternalLink size={16} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBug(bug)}
                      className="rounded-full p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      title="Expand bug report"
                    >
                      <Maximize2 size={18} />
                    </button>
                    <BugActions
                      bug={bug}
                      onStatusChange={onStatusChange}
                      onEdit={onEdit}
                    />
                  </div>
                </div>
                <div
                  className="prose prose-sm lg:prose-base prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 mt-4 max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: bug.description }}
                />

                {bug.images && bug.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {bug.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Bug screenshot ${index + 1}`}
                          className="h-48 w-full rounded-lg object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <BugDetailsModal bug={selectedBug!} isOpen={!!selectedBug} onClose={() => setSelectedBug(null)} />
    </div>
  );
}
