import React from "react";

const Table = () => {
  return (
    <table className="table-auto border-collapse border-gray-700 border-2">
      <thead>
        <tr className="border-gray-700 border-2">
          <th className="border-gray-700 border-2">Sr.No</th>
          <th className="border-gray-700 border-2">Taluka</th>
          <th className="border-gray-700 border-2">PHC</th>
          <th className="border-gray-700 border-2">Sub Center</th>
          <th className="border-gray-700 border-2">Village</th>
          <th className="border-gray-700 border-2">Patients Name</th>
          <th className="border-gray-700 border-2">Age</th>
          <th className="border-gray-700 border-2">M/F</th>
          <th className="border-gray-700 border-2">Patient's Phone No</th>
          <th className="border-gray-700 border-2">B.S. No.</th>
          <th className="border-gray-700 border-2">MF Count</th>
          <th className="border-gray-700 border-2">Type of Survey</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((index) => (
          <tr key={index}>
            <td className="w-16 h-6 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
            <td className="w-32 border-gray-700 border-2"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
