import { AnimatePresence, motion } from 'framer-motion';
import { Bug } from '../type';
import { Loader2, X } from 'lucide-react';
import { useBugContext } from '../provider/BugDashboardContext';
import { useEffect, useState } from 'react';

interface BugDetailsModalProps {
  bug: Bug;
  isOpen: boolean;
  onClose: () => void;
}

export default function BugDetailsModal({ bug, isOpen, onClose }: BugDetailsModalProps) {
  const { fetchImages, loadingImages } = useBugContext();
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchAndSetImages = async () => {
      if (isOpen) {
        const imageFetch = await fetchImages(bug.id);
        setImages(imageFetch);
      }
    };

    fetchAndSetImages();
  }, [isOpen, bug]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={`bug-details-modal-${bug.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed left-0 top-0 z-50 h-screen w-screen bg-black/50 text-black"
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="max-h-[75dvh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
                <div className="flex items-center justify-between border-b p-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{bug.title} </h2>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6 p-6">
                  <a
                    href={bug.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-lg text-blue-600 hover:text-blue-800"
                  >
                    {bug.url}
                  </a>

                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: bug.description }} />

                  {loadingImages ? (
                    <div className="row flex items-center justify-center gap-2">
                      <h1>Fetching Images</h1>
                      <Loader2 size={24} className="animate-spin" />
                    </div>
                  ) : images && images.length > 0 ? (
                    <div className="space-y-4">
                      {images.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg">
                          <img
                            src={image}
                            alt={`Bug screenshot ${index + 1}`}
                            className="max-h-[600px] w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <h1>No images found</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
