import { BackendUrl } from "@/Config";
import axios from "axios";
import React, { useState } from "react";

interface CreateWebinarProps {
  setOpenWebinarModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshWebinars?: () => void;
}

interface WebinarResponse {
  id?: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageName: string;
}

const CreateWebinar: React.FC<CreateWebinarProps> = ({
  setOpenWebinarModel,
  refreshWebinars,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [packageName, setPackageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [webinar, setWebinar] = useState<WebinarResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${BackendUrl}/webinar/create`,
        { title, date, zoomLink, thumbnail, packageName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWebinar(response.data);
      setSuccess(true);
      if (refreshWebinars) refreshWebinars();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-2">
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden h-auto bg-green-50 rounded-2xl shadow-xl flex flex-col items-center justify-center">
        {/* Green gradient decorations hidden on mobile */}
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-green-400 to-green-700 rounded-full opacity-80" />
        <div className="hidden sm:block absolute bottom-0 -right-12 w-40 h-20 bg-gradient-to-tr from-green-400 to-green-700 rounded-full opacity-80" />
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenWebinarModel(false)}
        >
          ×
        </button>
        <div className="mt-10 mb-4 text-center">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-green-900 to-green-400 text-xl md:text-3xl">
            FINITE MARSHALL CLUB
          </div>
        </div>
        {/* Form & Success */}
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
                placeholder="Date and Time"
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
                type="url"
                placeholder="Thumbnail URL"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <input
                type="text"
                placeholder="Package Name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
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
            <h1 className="text-2xl font-bold mb-6 text-green-800">
              Webinar Created Successfully 🎉
            </h1>
            {webinar && (
              <div className="space-y-2 mb-6 text-left">
                <p>
                  <strong>Title:</strong> {webinar.title}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(webinar.date).toLocaleString()}
                </p>
                <p>
                  <strong>Zoom Link:</strong>{" "}
                  <a href={webinar.zoomLink} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                    {webinar.zoomLink}
                  </a>
                </p>
                <p>
                  <strong>Thumbnail:</strong>{" "}
                    <img src={webinar.thumbnail} alt="" />
                </p>
                <p>
                  <strong>package Name:</strong> {webinar.packageName}
                </p>
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
