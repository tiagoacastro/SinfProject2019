import React from 'react';
import MaterialTable from 'material-table';

const LogsTable = props => {

    const { data, ...rest } = props;

    const columns = [
        {
            title: 'ID', field: 'id', render: (row) => `#${row.id}`
        },
        { title: 'Document', field: 'document' },
        { title: 'Issuer', field: 'issuer' },
        { title: 'Timestamp', field: 'timestamp', type: 'datetime' }
    ];

    return (
        <div>
            <MaterialTable
                title={props.title}
                columns={columns}
                data={data}
                parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
                components={{
                    Toolbar: props => (
                        <div style={{ display: 'none' }}> </div>
                    )
                }}
            />
        </div >
    );
}


export default LogsTable;