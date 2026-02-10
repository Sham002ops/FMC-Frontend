import { BackendUrl } from "@/Config";
import axios from "axios";
import React, { useState, useEffect } from "react";

interface CreateWebinarProps {
  setOpenWebinarModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshWebinars?: () => void;
}

interface WebinarDTO {
  id: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageId?: string;
}

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  userCoins: number;
  validityDays: number;
  features: string[];
  isActive: boolean;
}

const CreateWebinar: React.FC<CreateWebinarProps> = ({ setOpenWebinarModel, refreshWebinars }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [webinar, setWebinar] = useState<WebinarDTO | null>(null);
  
  const [packages, setPackages] = useState<Package[]>([]);

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${BackendUrl}/package/allpackages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = Array.isArray(response.data?.packages)
        ? response.data.packages
        : Array.isArray(response.data)
        ? response.data
        : [];
      
      setPackages(payload);
      console.log('✅ Fetched Packages:', payload);
    } catch (err) {
      console.error('❌ Error fetching packages:', err);
      setError("Failed to load packages. Please refresh.");
    } finally {
      setLoadingPackages(false);
    }
  };

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
    
    if (!selectedPackageId) {
      setError("Please select a package.");
      return;
    }

    // ✅ Validate date is not in the past
    const selectedDate = new Date(date);
    const now = new Date();
    
    if (selectedDate < now) {
      setError("Cannot schedule webinar in the past. Please select a future date and time.");
      return;
    }

    const isoDate = date ? new Date(date).toISOString() : "";

    // ✅ Get package name from selected package
    const selectedPackage = packages.find(p => p.id === selectedPackageId);
    const packageName = selectedPackage?.name || "";

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
      form.append("packageName", packageName); // ✅ Send packageName (string) for backend compatibility
      form.append("thumbnail", thumbnailFile);

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
      setSelectedPackageId("");
      setThumbnailFile(null);
      setPreview("");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Something went wrong. Please try again.";
      setError(msg);
      console.error('❌ Error creating webinar:', err);
    } finally {
      setLoading(false);
    }
  };

  const fullThumbUrl = webinar?.thumbnail
    ? `${BackendUrl}${webinar.thumbnail.startsWith("/") ? webinar.thumbnail : `/${webinar.thumbnail}`}`
    : "";

  const getSelectedPackageName = () => {
    const pkg = packages.find(p => p.id === selectedPackageId);
    return pkg?.name || "Unknown Package";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {success ? 'Success!' : 'Create New Webinar'}
              </h1>
              <p className="text-xs text-emerald-100">
                {success ? 'Webinar created successfully' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Close modal"
            onClick={() => setOpenWebinarModel(false)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {!success ? (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Webinar Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to Yoga"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    required
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getMinDateTime()}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⏰ Must be a future date and time
                  </p>
                </div>

                {/* Zoom Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zoom Link *
                  </label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    required
                  />
                </div>

                {/* Package Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Package *
                  </label>
                  {loadingPackages ? (
                    <div className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-2 text-xs text-gray-600">Loading...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white cursor-pointer text-sm"
                      required
                    >
                      <option value="">-- Select a Package --</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - ₹{pkg.priceInCoins} ({pkg.validityDays} days)
                        </option>
                      ))}
                    </select>
                  )}
                  {packages.length === 0 && !loadingPackages && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ No packages available. Please create packages first.
                    </p>
                  )}
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thumbnail Image *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    required
                  />
                  {preview && (
                    <div className="mt-3 relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border-2 border-emerald-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setPreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || loadingPackages}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Webinar
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            // Success View
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {webinar && (
                <div className="bg-white rounded-lg p-4 mb-4 text-left shadow-md space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-semibold min-w-[70px]">Title:</span>
                    <span className="text-gray-700">{webinar.title}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-semibold min-w-[70px]">Date:</span>
                    <span className="text-gray-700">{new Date(webinar.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-semibold min-w-[70px]">Package:</span>
                    <span className="text-gray-700">{getSelectedPackageName()}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-600 font-semibold min-w-[70px]">Zoom:</span>
                    <a 
                      href={webinar.zoomLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-teal-700 hover:text-teal-800 underline break-all text-xs"
                    >
                      {webinar.zoomLink}
                    </a>
                  </div>
                  {fullThumbUrl && (
                    <div className="mt-3">
                      <span className="text-emerald-600 font-semibold block mb-2">Thumbnail:</span>
                      <img 
                        src={fullThumbUrl} 
                        alt={webinar.title} 
                        className="w-full rounded-lg border-2 border-emerald-200" 
                      />
                    </div>
                  )}
                </div>
              )}
              
              <button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl text-sm"
                onClick={() => setOpenWebinarModel(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWebinar;
