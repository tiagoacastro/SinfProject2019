import React from 'react';
import MaterialTable from 'material-table';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    successIcon: {
        color: 'green',
    },
    insuccessIcon: {
        color: 'red',
    },
}));

const LogsTable = props => {
    const classes = useStyles();
    const { data, ...rest } = props;

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Timestamp', field: 'moment', type: 'datetime' },
        { title: 'Issuing Company', field: 'name' },
        { title: 'Document', field: 'document' },
        {
            title: 'Status', field: 'success', render: (row) => {
                if (row.success == true) return <FiberManualRecordIcon className={classes.successIcon} />;
                else return <FiberManualRecordIcon className={classes.insuccessIcon} />;;
            }
        },
        { title: '', field: 'message' },
    ];

    console.log(data)
    return (
        <div>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
                options={{
                    pageSize: 10
                }}
            />
        </div >
    );
}


export default LogsTable;