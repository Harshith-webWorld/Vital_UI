import React from "react";

const Table1 = () => {
  return (
    <table className="table-auto border-collapse border-gray-700 border-2">
      <thead>
        <tr className="border-gray-700 border-2">
          <th style={{ border: "1px solid #000000" }} className="w-36 border-gray-700 border-2">Name of Unit </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            Target for persons Exam.
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            No .of persons Exam.
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            No. of Achieved For B.S. collection
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            B.S. Exam.
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" colSpan={4}>
            Filaria Cases Detected
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" colSpan={3}>
            Rates
          </th>
        </tr>
        <tr>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">
            Sub- Unit/N.C./ A type Unit
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">MF</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Dis.</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Both</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Total</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">MF</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Dis.</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #000000" }} className="w-32 h-4 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table1;
