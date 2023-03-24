import React from "react";

const Table2 = () => {
  return (
    <table className="table-auto border-collapse border-gray-700 border-2">
      <thead>
        <tr className="border-gray-700 border-2">
          <th style={{ border: "1px solid #000000" }} className="w-36 border-gray-700 border-2" colSpan={3}>
            Treated
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            % of cases Treated
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            Population Covered
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2}>
            % of Population Covered
          </th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" rowSpan={2} colSpan={8}>
            Cases Remaining Un-Treated Due to
          </th>
        </tr>
        <tr>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2" colSpan={3}>
            New
          </th>
        </tr>
        <tr>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">MF</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Dis.</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Total</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Preg</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Abs</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Ref</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">ill</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Death</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Pan</th>
          <th style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2"></td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
            <td style={{ border: "1px solid #000000" }} className="w-32 border-gray-700 border-2 text-center">-</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table2;
