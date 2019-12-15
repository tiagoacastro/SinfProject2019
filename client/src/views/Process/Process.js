import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getProcesses } from './requests';
import MaterialTable from 'material-table';
import { Button, Box } from '@material-ui/core';
import { ProcessDialog } from './components';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Process = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        dialogOpen: false,
        processes: [{ id: 1 }],
    });

    const handleDialogClose = async function () {
        setState({ ...state, dialogOpen: false });
    };

    const handleDialogOpen = async function () {
        setState({ ...state, dialogOpen: true });
    };

    const columns = [
        {
            title: 'ID', field: 'id',
            render: (row) => {
                return <Button variant="outlined"
                    onClick={handleDialogOpen}
                > {row.id}</Button >
            }
        },
        { title: 'Name', field: 'name' },
        { title: 'Active', field: 'active', type: 'boolean' },
        { title: 'N Steps', field: 'steps' },
    ];

    React.useEffect(() => {
        getProcesses()
            .then((response) => {
                const data = response.data.processes;
                setState({ ...state, processes: data })
            })
            .catch((err) => { });
    }, [state]);

    return (
        <div className={classes.root}>
            <Box mb={3}>
                <Button variant="contained" color="primary">Create Process</Button>
            </Box>
            <MaterialTable
                columns={columns}
                data={state.processes}
                options={{
                    toolbar: false
                }}
            />
            <ProcessDialog open={state.dialogOpen} close={handleDialogClose} />

        </div>
    );
};

export default Process;
