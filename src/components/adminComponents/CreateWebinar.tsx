import { BackendUrl } from "@/Config";
import axios from "axios";
import React, { useState } from "react";

interface CreateWebinarProps {
  setOpenWebinarModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshWebinars?: () => void;
}

interface WebinarDTO {
  id: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string; // server path like /uploads/webinars/xxx.jpg
  packageId?: string;
}

const CreateWebinar: React.FC<CreateWebinarProps> = ({ setOpenWebinarModel, refreshWebinars }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // HTML datetime-local value
  const [zoomLink, setZoomLink] = useState("");
  const [packageName, setPackageName] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [webinar, setWebinar] = useState<WebinarDTO | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbnailFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!thumbnailFile) {
      setError("Please choose a thumbnail image.");
      return;
    }
    // Convert datetime-local (e.g., 2025-10-15T10:00) to ISO string expected by backend
    const isoDate = date ? new Date(date).toISOString() : "";

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        setLoading(false);
        return;
      }
      const form = new FormData();
      form.append("title", title);
      form.append("date", isoDate);
      form.append("zoomLink", zoomLink);
      form.append("packageName", packageName);
      form.append("thumbnail", thumbnailFile); // field name must be 'thumbnail'

      const res = await axios.post(
        `${BackendUrl}/webinar/create`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const created = res.data?.webinar as WebinarDTO;
      setWebinar(created);
      setSuccess(true);
      if (refreshWebinars) refreshWebinars();
      // Reset form
      setTitle("");
      setDate("");
      setZoomLink("");
      setPackageName("");
      setThumbnailFile(null);
      setPreview("");
    } catch (err) {
      const msg = err?.response?.data?.error || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fullThumbUrl = webinar?.thumbnail
    ? `${BackendUrl}${webinar.thumbnail.startsWith("/") ? webinar.thumbnail : `/${webinar.thumbnail}`}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-2">
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden h-auto bg-green-50 rounded-2xl shadow-xl flex flex-col items-center justify-center">
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenWebinarModel(false)}
        >
          ×
        </button>

        {!success ? (
          <div className="w-full px-4 pt-6 pb-10 max-w-sm mx-auto md:max-w-md">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-5 text-green-800">
              Create New Webinar
            </h1>
            {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Webinar Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="url"
                placeholder="Zoom Link"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="text"
                placeholder="Package Name (e.g., Elite)"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail Image *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="w-full"
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg mt-3"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Webinar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-sm mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-green-800">Webinar Created Successfully 🎉</h1>
            {webinar && (
              <div className="space-y-2 mb-6 text-left">
                <p><strong>Title:</strong> {webinar.title}</p>
                <p><strong>Date:</strong> {new Date(webinar.date).toLocaleString()}</p>
                <p>
                  <strong>Zoom Link:</strong>{" "}
                  <a href={webinar.zoomLink} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                    {webinar.zoomLink}
                  </a>
                </p>
                {fullThumbUrl && (
                  <div>
                    <strong>Thumbnail:</strong>
                    <img src={fullThumbUrl} alt={webinar.title} className="mt-2 rounded" />
                  </div>
                )}
              </div>
            )}
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={() => setOpenWebinarModel(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWebinar;
