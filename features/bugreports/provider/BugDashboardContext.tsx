import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

import { Bug, BugCategory, BugStatus } from '../type';
import axios from 'axios';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface BugContextType {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  bugs: Bug[];
  setBugs: (bugs: Bug[]) => void;
  selectedCategory: BugCategory;
  setSelectedCategory: (category: BugCategory) => void;
  editingBug: Bug | undefined;
  setEditingBug: (bug: Bug | undefined) => void;
  isSubmitting: boolean;
  handleAddBug: (bug: Bug) => Promise<void>;
  handleStatusChange: (bug: Bug, status: BugStatus) => Promise<void>;
  handleEdit: (bug: Bug) => void;
  fetchBugs: (page: number, limit?: number) => Promise<Bug[]>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isUpdatingStatus: boolean;
  setIsUpdatingStatus: (isUpdating: boolean) => void;
  handleDelete: (bug: Bug) => Promise<boolean>;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
}

const BugContext = createContext<BugContextType | undefined>(undefined);

export const BugProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BugCategory>('frontend');
  const [editingBug, setEditingBug] = useState<Bug | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBugs = async (page = 1, limit = 10) => {
    setIsLoading(true);
    const { data } = await axios.get('/api/getBugs', {
      params: {
        page,
        limit,
      },
    });
    setBugs(data?.data ?? []);
    setIsLoading(false);
    return data?.data ?? [];
  };

  const handleAddBug = async (bug: Bug) => {
    setIsSubmitting(true);
    try {
      if (editingBug) {
        const response = await fetch('/api/editBug', {
          method: 'POST',
          body: JSON.stringify(bug),
        });
        if (response.ok) {
          await fetchBugs();
          toast.success('Bug report updated successfully');
        } else {
          toast.error('Failed to update bug report');
        }
      } else {
        const response = await fetch('/api/createBugs', {
          method: 'POST',
          body: JSON.stringify(bug),
        });
        if (response.ok) {
          await fetchBugs();
          toast.success('Bug report submitted successfully');
        } else {
          toast.error('Failed to submit bug report');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setEditingBug(undefined);
    }
  };

  const handleDelete = async (bug: Bug) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete('/api/deleteBug', { data: bug });
      if (response.status === 200) {
        await fetchBugs();
        toast.success('Bug report deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete bug report');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete bug report');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (bug: Bug, status: BugStatus) => {
    setIsUpdatingStatus(true);
    try {
      const response = await axios.post('/api/editBug', {
        ...bug,
        status,
        resolved_at: status === 'resolved' ? new Date() : bug.resolvedAt,
      });
      if (response.status === 200) {
        await fetchBugs();
        toast.success(`Bug status updated to ${status}`);
      } else {
        throw new Error('Failed to update bug status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bug status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEdit = (bug: Bug) => {
    setEditingBug(bug);
    setIsModalOpen(true);
  };

  return (
    <BugContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        bugs,
        setBugs,
        selectedCategory,
        setSelectedCategory,
        editingBug,
        setEditingBug,
        isSubmitting,
        isUpdatingStatus,
        setIsUpdatingStatus,
        handleAddBug,
        handleStatusChange,
        handleEdit,
        fetchBugs,
        isLoading,
        setIsLoading,
        handleDelete,
        isDeleting,
        setIsDeleting,
      }}
    >
      {children}
    </BugContext.Provider>
  );
};

export const useBugContext = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider');
  }
  return context;
};
