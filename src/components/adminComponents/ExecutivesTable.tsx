import React from "react";

interface Executive {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  isBanned: boolean;
  joinedAt: string | Date;
}

interface ExecutivesTableProps {
  allExecutives: Executive[];
}

const ExecutivesTable: React.FC<ExecutivesTableProps> = ({ allExecutives }) => {
  if (allExecutives.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-16 sm:mt-20">
        No executives found.
      </p>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">
                Referral Code
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase">
                Banned
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase">
                Joined At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allExecutives.map((exec) => (
              <tr key={exec.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                  {exec.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-600 break-all">
                  {exec.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center text-blue-600">
                  <a href="#" className="hover:underline">
                    {exec.referralCode}
                  </a>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  {exec.isBanned ? (
                    <span className="text-red-500 font-semibold">Yes</span>
                  ) : (
                    <span className="text-green-500 font-semibold">No</span>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                  {new Date(exec.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden space-y-4">
        {allExecutives.map((exec) => (
          <div
            key={exec.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{exec.name}</span>
              <span
                className={`font-semibold ${
                  exec.isBanned ? "text-red-500" : "text-green-500"
                }`}
              >
                {exec.isBanned ? "Banned" : "Active"}
              </span>
            </div>
            <div className="text-gray-600 text-sm break-words mb-1">
              <strong>Email:</strong> {exec.email}
            </div>
            <div className="text-blue-600 text-sm mb-1">
              <strong>Referral Code:</strong>{" "}
              <a href="#" className="hover:underline">
                {exec.referralCode}
              </a>
            </div>
            <div className="text-gray-500 text-sm">
              <strong>Joined At:</strong>{" "}
              {new Date(exec.joinedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExecutivesTable;
