import React, { useRef, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';

type Webinar = {
  id: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  package?: { id: string; name: string };
  packageId?: string;
};

interface Props {
  webinar: Webinar;
  onUpdated?: (w: Webinar) => void;
  onDeleted?: (id: string) => void;
}

const WebinarCard: React.FC<Props> = ({ webinar, onUpdated, onDeleted }) => {
  const fullThumb = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BackendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const imageUrl = fullThumb(webinar.thumbnail);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const openFilePicker = () => fileInputRef.current?.click();

  const handleEdit = async (updates?: { title?: string; date?: string; zoomLink?: string; packageName?: string; file?: File }) => {
    try {
      setBusy(true);
      setError("");
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Missing admin token. Please log in again.");
        return;
      }
      const form = new FormData();
      if (updates?.title) form.append('title', updates.title);
      if (updates?.date) form.append('date', new Date(updates.date).toISOString());
      if (updates?.zoomLink) form.append('zoomLink', updates.zoomLink);
      if (updates?.packageName) form.append('packageName', updates.packageName);
      if (updates?.file) form.append('thumbnail', updates.file);

      const res = await axios.patch(`${BackendUrl}/webinar/update/${webinar.id}`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const updated = res.data?.webinar as Webinar;
      onUpdated?.(updated);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to update webinar");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const confirmDel = window.confirm(`Delete webinar "${webinar.title}"? This cannot be undone.`);
    if (!confirmDel) return;
    try {
      setBusy(true);
      setError("");
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Missing admin token. Please log in again.");
        return;
      }
      await axios.delete(`${BackendUrl}/webinar/delete/${webinar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      onDeleted?.(webinar.id);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to delete webinar");
    } finally {
      setBusy(false);
    }
  };

  const onPickNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleEdit({ file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      {/* Image */}
      <div className="w-full">
        <img
          src={imageUrl || '/placeholder-image.png'}
          alt={webinar.title}
          className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png'; }}
        />
      </div>

      {/* Text */}
      <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{webinar.title}</h3>
      <p className="text-gray-600 mb-1 text-sm sm:text-base">{new Date(webinar.date).toLocaleString()}</p>

      <a
        href={webinar.zoomLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline inline-block mb-3 break-all text-sm sm:text-base"
      >
        Join Webinar
      </a>

      {error && <p className="text-red-600 text-xs sm:text-sm mb-2">{error}</p>}

      {/* Actions - stack on mobile, inline on larger screens */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          disabled={busy}
          onClick={openFilePicker}
          className="w-full sm:w-auto px-3 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
          title="Replace thumbnail"
        >
          Replace Image
        </button>
        <button
          disabled={busy}
          onClick={handleDelete}
          className="w-full sm:w-auto px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          Delete
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={onPickNewImage}
      />
    </div>
  );
};

export default WebinarCard;
