"use client";

import type React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Column {
  Header: string;
  accessor: string;
  Cell?: (props: { value: any; row: any }) => React.ReactNode;
}

interface DatatableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  rowClassName?: string;
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const Datatable: React.FC<DatatableProps> = ({
  columns,
  data,
  loading = false,
  rowClassName = "",
  onView,
  onEdit,
  onDelete,
}) => {
  const hasActions = onView || onEdit || onDelete;

  return (
    <div className="w-full">
      <div
        className="overflow-hidden rounded-2xl border shadow-lg"
        style={{
          borderColor: "var(--border)",
          background: "var(--card)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "var(--primary-foreground)",
                  borderBottom: "1.5px solid var(--border)",
                }}
              >
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className="px-6 py-4 text-left text-base font-semibold tracking-wide"
                    style={{
                      color: "var(--primary)",
                      letterSpacing: "0.02em",
                      background: "transparent",
                    }}
                  >
                    {col.Header}
                  </th>
                ))}
                {hasActions && (
                  <th
                    className="px-6 py-4 text-left text-base font-semibold tracking-wide"
                    style={{ color: "var(--primary)" }}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full animate-spin"
                        style={{
                          border: "4px solid var(--primary)",
                          borderTop: "4px solid var(--secondary)",
                          borderRight: "4px solid var(--primary)",
                          borderBottom: "4px solid var(--secondary)",
                          borderLeft: "4px solid var(--primary)",
                        }}
                      />
                      <p style={{ color: "var(--muted-foreground)" }}>
                        Loading data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div
                        className="h-14 w-14 rounded-full flex items-center justify-center"
                        style={{
                          background: "var(--muted)",
                          border: "2px solid var(--primary)",
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="var(--primary)"
                            strokeWidth="2"
                            fill="var(--muted)"
                          />
                          <path
                            d="M8 12h8M12 8v8"
                            stroke="var(--secondary)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p
                          className="text-base font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          No data found
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          There are no records to display at the moment.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.room_id || idx}
                    className={`group transition-colors duration-150 ${rowClassName}`}
                    style={{
                      background: "var(--card)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--muted)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--card)")
                    }
                  >
                    {columns.map((col) => (
                      <td
                        key={col.accessor}
                        className="px-6 py-4 text-sm"
                        style={{ color: "var(--foreground)" }}
                      >
                        <div className="max-w-xs truncate">
                          {col.Cell
                            ? col.Cell({ value: row[col.accessor], row })
                            : row[col.accessor] || (
                                <span
                                  style={{
                                    color: "var(--muted-foreground)",
                                    fontStyle: "italic",
                                  }}
                                >
                                  —
                                </span>
                              )}
                        </div>
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {onView && (
                            <button
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                              style={{
                                color: "var(--muted-foreground)",
                                transition: "all 0.2s",
                              }}
                              title="View details"
                              onClick={() => onView(row)}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "var(--primary)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--muted-foreground)")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                              style={{
                                color: "var(--muted-foreground)",
                                transition: "all 0.2s",
                              }}
                              title="Edit record"
                              onClick={() => onEdit(row)}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--secondary)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--muted-foreground)")
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                              style={{
                                color: "var(--muted-foreground)",
                                transition: "all 0.2s",
                              }}
                              title="Delete record"
                              onClick={() => onDelete(row)}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--destructive)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--muted-foreground)")
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Datatable;
