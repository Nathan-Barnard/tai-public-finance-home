import { useId, useState } from 'react';

import {
  matrixCell,
  matrixColumns,
  matrixRows,
  type Menu,
  type TaxMode,
} from '@/lib/lab-model';

type Props = {
  /** The lab's current setting, highlighted in the matrix. */
  current: { tax: TaxMode; menu: Menu };
};

/**
 * The two-by-three comparison. Desktop shows the whole matrix with a
 * selected-cell inspector; small screens get two selectors, the selected
 * comparison, and an expandable text table of all six.
 */
export function HumanComparisonMatrix({ current }: Props) {
  const [selected, setSelected] = useState<{ tax: TaxMode; menu: Menu }>(
    current,
  );
  const id = useId();
  const cell = matrixCell(selected.tax, selected.menu);
  const rowLabel = matrixRows.find((r) => r.id === selected.tax)?.label;
  const colLabel = matrixColumns.find((c) => c.id === selected.menu)?.label;
  const isCurrent =
    selected.tax === current.tax && selected.menu === current.menu;

  return (
    <div className="matrix">
      <table className="matrix__grid">
        <caption className="sr-only">
          Comparison of public tools. Select a cell to read it in the inspector.
        </caption>
        <thead>
          <tr>
            <td className="matrix__corner">
              <span className="sr-only">Tax policy by public asset menu</span>
            </td>
            {matrixColumns.map((column) => (
              <th key={column.id} scope="col" className="matrix__col-head">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrixRows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="matrix__row-head">
                {row.label}
              </th>
              {matrixColumns.map((column) => {
                const on =
                  selected.tax === row.id && selected.menu === column.id;
                const here =
                  current.tax === row.id && current.menu === column.id;
                return (
                  <td key={column.id} className="matrix__cell-wrap">
                    <button
                      type="button"
                      className={`matrix__cell ${on ? 'is-selected' : ''} ${here ? 'is-current' : ''}`}
                      aria-pressed={on}
                      onClick={() =>
                        setSelected({ tax: row.id, menu: column.id })
                      }
                    >
                      <span className="matrix__cell-text">
                        {matrixCell(row.id, column.id).text}
                      </span>
                      {here && (
                        <span className="matrix__cell-flag">
                          your lab setting
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="matrix__compact">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-tax`}>
            Tax policy
          </label>
          <select
            id={`${id}-tax`}
            className="select"
            value={selected.tax}
            onChange={(e) =>
              setSelected({ ...selected, tax: e.target.value as TaxMode })
            }
          >
            {matrixRows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${id}-menu`}>
            Public asset menu
          </label>
          <select
            id={`${id}-menu`}
            className="select"
            value={selected.menu}
            onChange={(e) =>
              setSelected({ ...selected, menu: e.target.value as Menu })
            }
          >
            {matrixColumns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="matrix__inspector" aria-live="polite" aria-atomic="true">
        <p className="t-eyebrow">
          {rowLabel} · {colLabel}
          {isCurrent ? ' · your lab setting' : ''}
        </p>
        <p className="t-statement matrix__inspector-text">{cell.text}</p>
      </div>

      <details className="disclosure matrix__table">
        <summary>All six comparisons as text</summary>
        <div className="disclosure__body">
          <table>
            <caption className="sr-only">
              Tax policy by public asset menu
            </caption>
            <thead>
              <tr>
                <th scope="col">Tax policy</th>
                {matrixColumns.map((column) => (
                  <th key={column.id} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  {matrixColumns.map((column) => (
                    <td key={column.id}>
                      {matrixCell(row.id, column.id).text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
