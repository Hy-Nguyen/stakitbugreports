'use client';

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { Bug, BugCategory, BugStatus } from '../type';
import { X, Trash2, Plus, Loader2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { AnimatePresence, motion } from 'framer-motion';

import { BugSchema } from '../schema';
import { useBugContext } from '../provider/BugDashboardContext';

interface BugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bug: Bug) => void;
  category: BugCategory;
  editingBug?: Bug;
  isSubmitting: boolean;
}

export default function BugModal({ isOpen, onClose, onSubmit, category, editingBug, isSubmitting }: BugModalProps) {
  const initialFormData: Bug = {
    title: '',
    author: '',
    url: '',
    description: '',
    images: [] as string[],
    category: category,
    status: 'open' as BugStatus,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<BugCategory>(category);
  const { handleDelete, isDeleting } = useBugContext();

  const { fetchImages, loadingImages } = useBugContext();

  useEffect(() => {
    const fetchAndSetImages = async () => {
      if (isOpen && editingBug) {
        const imageFetch = await fetchImages(editingBug.id);
        setFormData((prev) => ({ ...prev, images: imageFetch }));
      }
    };

    fetchAndSetImages();
  }, [isOpen, editingBug]);

  useEffect(() => {
    setFormData(editingBug || initialFormData);
  }, [editingBug, category]);

  useEffect(() => {
    setSelectedCategory(category);
    setFormData((prev) => ({ ...prev, category }));
  }, [category]);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!isOpen) return;
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, reader.result as string],
                }));
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [isOpen]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDeleteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    try {
      BugSchema.parse(formData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors = e.errors.reduce(
          (acc, error) => {
            acc[error.path[0]] = error.message;
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
      });
      setFormData(initialFormData);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const CategorySection = () => (
    <div className="mt-4 flex gap-4">
      <label className="mb-1 block text-sm font-medium text-gray-800">Category</label>
      <div className="flex gap-4">
        {['frontend', 'backend'].map((cat) => (
          <label key={cat} className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              checked={selectedCategory === cat}
              onChange={() => {
                setSelectedCategory(cat as BugCategory);
                setFormData((prev) => ({ ...prev, category: cat as BugCategory }));
              }}
            />
            <span className="ml-2 capitalize">{cat}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="bug-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-2 px-4 text-black lg:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="my-4 max-h-[75dvh] w-full max-w-xl overflow-y-auto rounded-lg bg-white lg:my-8 lg:max-w-2xl">
            <div className="flex items-center justify-between border-b p-4 lg:p-6">
              <h2 className="text-lg font-semibold lg:text-xl">{editingBug ? 'Edit Bug Report' : 'Report New Bug'}</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-4 lg:p-6">
              <InputField
                label="Title"
                type="text"
                value={formData.title}
                passedOnChange={(value: string) => setFormData((prev) => ({ ...prev, title: value }))}
                error={errors.title}
                placeholder="Enter a title for your bug report"
              />
              <CategorySection />
              <InputField
                label="Author"
                type="text"
                value={formData.author}
                passedOnChange={(value: string) => setFormData((prev) => ({ ...prev, author: value }))}
                error={errors.author}
                placeholder="Enter your name"
              />
              <InputField
                label="URL"
                type="text"
                value={formData.url}
                passedOnChange={(value: string) => setFormData((prev) => ({ ...prev, url: value }))}
                error={errors.url}
                placeholder="https://stakit.com/wtf"
              />
              {editingBug && (
                <InputField
                  label="Note From Dev"
                  type="text"
                  value={formData.dev_note || ''}
                  passedOnChange={(value: string) => setFormData((prev) => ({ ...prev, dev_note: value }))}
                />
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value: string) => setFormData((prev) => ({ ...prev, description: value }))}
                />
                <ErrorMessage error={errors.description} />
              </div>
              {editingBug && loadingImages ? (
                <div className="flex w-full flex-col items-center justify-center">
                  <Loader2 size={24} className="animate-spin" />
                  <h1>Getting Images</h1>
                </div>
              ) : (
                <ImageUploadSection
                  images={formData.images}
                  onImageUpload={handleImageUpload}
                  onDeleteImage={handleDeleteImage}
                />
              )}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {editingBug && (
                  <button
                    type="button"
                    onClick={async () => {
                      const response = await handleDelete(formData);
                      if (response) {
                        handleClose();
                      }
                    }}
                    disabled={isDeleting}
                    className="rounded-lg border bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : editingBug ? (
                    'Update Bug Report'
                  ) : (
                    'Submit Bug Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;

  value: string;

  error?: string;
  passedOnChange: (value: string) => void;
}

function InputField({ label, type, value, passedOnChange, error, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => passedOnChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      <ErrorMessage error={error} />
    </div>
  );
}

function ErrorMessage({ error }: { error: string | undefined | null }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ImageUploadSection({
  images,
  onImageUpload,
  onDeleteImage,
}: {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (index: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="group relative">
            <img src={image} alt={`Screenshot ${index + 1}`} className="h-48 w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => onDeleteImage(index)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-4 transition-colors hover:bg-gray-100">
          <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="cursor-pointer text-center text-blue-600 hover:text-blue-800">
            <div className="mb-2">
              <Plus size={24} className="mx-auto" />
            </div>
            Click to upload
            <span className="mt-1 block text-sm text-gray-500">or paste an image</span>
          </label>
        </div>
      </div>
    </div>
  );
}
