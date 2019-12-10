import React from 'react';
import MaterialTable from 'material-table';

const LogsTable = props => {

    const [state] = React.useState({
        columns: [
            { title: 'ID', field: 'id', render: (row) => `#${row.id}` },
            { title: 'Timestamp', field: 'timestamp', type: 'datetime' },
            { title: 'Type', field: 'type', lookup: { 1: 'Company1', 2: 'Company2' } },
        ],
        data: [
            { id: '48309832', timestamp: '03/01/1029', type: 1, status: 1, },
            { id: '48309833', timestamp: '03/01/1029', type: 2, status: 2, },
        ],
        selectedRow: [{}],
    });

    return (
        <div>
            <MaterialTable
                title={props.title}
                columns={state.columns}
                data={state.data}
                actions={[
                    (row) =>
                        (row.status === 1 ?
                            {
                                onClick: (_, rowData) => { },
                                icon: 'replay',
                            }
                            : { hidden: true }
                        )
                ]}
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