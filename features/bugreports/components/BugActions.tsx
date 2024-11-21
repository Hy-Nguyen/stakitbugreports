import { useEffect, useRef, useState } from 'react';
import { useBugContext } from '../provider/BugDashboardContext';
import { Bug, BugStatus } from '../type';
import { Edit2, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

interface BugActionsProps {
  bug: Bug;
  onStatusChange: (bug: Bug, status: BugStatus) => void;
  onEdit: (bug: Bug) => void;
}

export default function BugActions({ bug, onStatusChange, onEdit }: BugActionsProps) {
  const { isUpdatingStatus } = useBugContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (status: BugStatus) => {
    onStatusChange(bug, status);
    setIsDropdownOpen(false);
  };

  const buttonClass =
    'rounded-md p-1.5 w-full text-left text-base transition-colors duration-200 ease-in-out text-gray-500 hover:bg-gray-50  disabled:opacity-50';

  return (
    <div ref={dropdownRef} className="relative flex items-center gap-2">
      <button onClick={() => onEdit(bug)} disabled={isUpdatingStatus} className={buttonClass} title="Edit bug report">
        <Edit2 size={18} />
      </button>

      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isUpdatingStatus}
        className={buttonClass}
        title="Change status"
      >
        <ChevronDown size={18} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {bug.status === 'open' && (
                <>
                  <button
                    onClick={() => handleStatusChange('need-review')}
                    className={`${buttonClass} text-yellow-600`}
                    role="menuitem"
                  >
                    Mark as Needs Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className={`${buttonClass} text-green-600`}
                    role="menuitem"
                  >
                    Mark as Resolved
                  </button>
                </>
              )}
              {bug.status !== 'open' && (
                <>
                  <button
                    onClick={() => handleStatusChange('open')}
                    className={`${buttonClass} text-blue-500`}
                    role="menuitem"
                  >
                    Reopen
                  </button>
                  <button
                    onClick={() => handleStatusChange('need-review')}
                    className={`${buttonClass} text-yellow-600`}
                    role="menuitem"
                  >
                    Move to Review
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
