import { BackendUrl } from "@/Config";
import axios from "axios";
import React, { useMemo, useState } from "react";

interface CreatePackageProps {
  setOpenPackageModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshPackages?: () => void;
}

interface PackageDTO {
  id: string;
  name: string;
  priceInCoins: number;
  validityDays: number;
  features: string[];
}

const CreatePackage: React.FC<CreatePackageProps> = ({ setOpenPackageModel, refreshPackages }) => {
  const [name, setName] = useState("");
  const [priceInCoins, setPriceInCoins] = useState<number | "">("");
  const [validityYears, setValidityYears] = useState<number | "">(""); // UX in years
  const [featuresText, setFeaturesText] = useState(""); // one per line or comma-separated
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState<PackageDTO | null>(null);

  const features: string[] = useMemo(() => {
    if (!featuresText.trim()) return [];
    // Split by newline first; if a single line, split by comma as fallback
    const parts = featuresText.includes("\n")
      ? featuresText.split("\n")
      : featuresText.split(",");
    return parts
      .map((s) => s.trim())
      .filter(Boolean);
  }, [featuresText]);

  const validityDays = useMemo(() => {
    if (validityYears === "" || !Number.isFinite(Number(validityYears))) return 0;
    // Use 365.25 average to include leap years
    return Math.round(Number(validityYears) * 365.25);
  }, [validityYears]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation matching backend
    if (!name.trim()) {
      setError("Package name is required.");
      return;
    }
    if (priceInCoins === "" || Number(priceInCoins) <= 0) {
      setError("Price (coins) must be a positive number.");
      return;
    }
    if (!validityDays || validityDays <= 0) {
      setError("Validity (years) must be greater than 0.");
      return;
    }
    if (!features.length) {
      setError("Please add at least one feature.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        name: name.trim(),
        priceInCoins: Number(priceInCoins),
        validityDays,
        features,
      };

      const res = await axios.post(
        `${BackendUrl}/package/create-package`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const pkg = res.data?.package as PackageDTO;
      setCreated(pkg);
      setSuccess(true);

      // Reset form
      setName("");
      setPriceInCoins("");
      setValidityYears("");
      setFeaturesText("");

      if (refreshPackages) refreshPackages();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (typeof err?.message === "string" ? err.message : "Failed to create package");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2">
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Close */}
        <button
          className="absolute top-3 right-4 text-2xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenPackageModel(false)}
        >
          ×
        </button>

        {!success ? (
          <div className="w-full px-4 pt-8 pb-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center mb-5 text-slate-800">
              Create New Package
            </h1>
            {error && (
              <p className="text-red-600 mb-3 text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Package Name (e.g., Elite)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                min={1}
                placeholder="Price in Coins (e.g., 120000)"
                value={priceInCoins}
                onChange={(e) =>
                  setPriceInCoins(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Validity in Years
                </label>
                <input
                  type="number"
                  min={1}
                  step="0.25"
                  placeholder="Years (e.g., 50)"
                  value={validityYears}
                  onChange={(e) =>
                    setValidityYears(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Will be saved as {validityDays} days.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Features (one per line or comma-separated)
                </label>
                <textarea
                  placeholder="Education, Health, Wealth&#10;Power, AI"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  rows={5}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {!!features.length && (
                  <p className="mt-1 text-xs text-gray-500">
                    {features.length} feature(s) will be saved.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Package"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-emerald-700">
              Package Created Successfully 🎉
            </h2>

            {created && (
              <div className="text-left space-y-2 mb-6">
                <p><strong>Name:</strong> {created.name}</p>
                <p><strong>Price (coins):</strong> {created.priceInCoins.toLocaleString()}</p>
                <p><strong>Validity (days):</strong> {created.validityDays}</p>
                <p><strong>Features:</strong> {created.features.join(", ")}</p>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <button
                className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300"
                onClick={() => {
                  setSuccess(false);
                  setCreated(null);
                }}
              >
                Create Another
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setOpenPackageModel(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePackage;
