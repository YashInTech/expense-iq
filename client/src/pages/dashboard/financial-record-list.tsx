import { useMemo, useState } from 'react';
import {
  FinancialRecord,
  useFinancialRecords,
} from '../../contexts/financial-record-context';
import { useTable, Column, CellProps, Row } from 'react-table';

interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? 'pointer' : 'default' }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
      ) : typeof value === 'string' ? (
        value
      ) : value instanceof Date ? (
        new Date(value).toLocaleDateString()
      ) : (
        value?.toString() || ''
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord, loading, error } =
    useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? '', { ...records[rowIndex], [columnId]: value });
  };

  const handleClick = (row: Row<FinancialRecord>) => {
    console.log('Row clicked:', row.original);
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: 'Description',
        accessor: 'description',
        Cell: (props: CellProps<FinancialRecord>) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: (props: CellProps<FinancialRecord>) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: (props: CellProps<FinancialRecord>) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
        Cell: (props: CellProps<FinancialRecord>) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: (props: CellProps<FinancialRecord>) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      },
      {
        Header: 'Actions',
        id: 'delete',
        Cell: ({ row }: CellProps<FinancialRecord>) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? '')}
            className='delete'
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='spinner'></div>
        <p>Loading financial records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <p className='error-message'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='retry-button'
        >
          Retry
        </button>
      </div>
    );
  }

  // If no records are available
  if (records.length === 0) {
    return (
      <div className='empty-records'>
        <h3>No financial records found</h3>
        <p>Add your first financial record to get started.</p>
      </div>
    );
  }

  return (
    <div className='table-container'>
      <table {...getTableProps()} className='table'>
        <thead>
          {headerGroups.map((hg) => {
            const { key, ...headerGroupProps } = hg.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroupProps}>
                {hg.headers.map((column) => {
                  const { key, ...headerProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...headerProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...rowProps } = {
              key: row.id,
              onClick: () => handleClick(row),
            };
            return (
              <tr key={key} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...cellProps}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
