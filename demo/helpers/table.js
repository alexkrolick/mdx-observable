import React from "react";
import key from "weak-key";

function Table({ data, className = "" }) {
  const [headers, ...rows] = data;
  return (
    <table className={className}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={h + "-" + i}>
              {h.charAt(0).toUpperCase()}
              {h.slice(1)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={key(row)}>
            {row.map((d, i) => (
              <td key={d + "-" + i}>{d}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
