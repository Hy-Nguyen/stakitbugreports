'use client';

import { Plus } from 'lucide-react';
import { useBugContext } from '../provider/BugDashboardContext';
import BugList from './BugList';
import BugModal from './BugModal';
import CategoryToggle from './CategoryToggle';
import { useEffect } from 'react';
import axios from 'axios';

export default function BugDashboard() {
  const {
    isModalOpen,
    setIsModalOpen,
    bugs,
    selectedCategory,
    setSelectedCategory,
    editingBug,
    isSubmitting,
    handleAddBug,
    handleStatusChange,
    handleEdit,
    setEditingBug,
    fetchBugs,
  } = useBugContext();

  // useEffect(() => {
  //   fetchBugs();
  // }, []);

  const filteredBugs = bugs.filter((bug) => bug.category === selectedCategory);

  return (
    <div className="px-4 lg:mx-auto lg:max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Bug Reports</h1>
          <CategoryToggle selectedCategory={selectedCategory} onToggle={setSelectedCategory} />
          <button onClick={() => fetchBugs()} className="rounded-md bg-blue-600 px-4 py-2 text-white">
            Refresh
          </button>
        </div>
        <button
          onClick={() => {
            setEditingBug(undefined);
            setIsModalOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 lg:w-auto"
        >
          <Plus size={20} />
          Report Bug
        </button>
      </div>

      <BugList bugs={filteredBugs} onStatusChange={handleStatusChange} onEdit={handleEdit} />

      <BugModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBug(undefined);
        }}
        onSubmit={handleAddBug}
        category={selectedCategory}
        editingBug={editingBug}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
