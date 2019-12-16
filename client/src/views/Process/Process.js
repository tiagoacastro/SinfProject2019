import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getProcesses } from './requests';
import MaterialTable from 'material-table';
import { Button, Box } from '@material-ui/core';
import { AddProcessDialog, DetailsProcessDialog } from './components';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Process = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        detailsDialogOpen: false,
        addDialogOpen: false,
        processes: [],
        selectedData: [],
    });

    const handleDetailsDialogClose = () => {
        setState({ ...state, detailsDialogOpen: false });
    };

    const handleAddDialogClose = () => {
        setState({ ...state, detailsDialogOpen: false });
    };

    const handleDialogOpen = row => {
        setState({ ...state, detailsDialogOpen: true, selectedData: row });
    };

    React.useEffect(() => {
        getProcesses()
            .then((response) => {
                let data = response.data.processes;
                data.forEach(process => {
                    process.steps = process.events.length
                });
                console.log(data)
                setState({ ...state, processes: data })
            })
            .catch((err) => { });
    }, []);

    const columns = [
        {
            title: 'ID', field: 'id',
            render: (row) => {
                return <Button variant="outlined"
                    onClick={() => handleDialogOpen(row)}
                > {row.id}</Button >
            }
        },
        { title: 'Name', field: 'name' },
        { title: 'Active', field: 'active', type: 'boolean' },
        { title: 'N Steps', field: 'steps' },
    ];

    return (
        <div className={classes.root}>
            <Box mb={3} display="flex" flexDirection="row-reverse">
                <Button variant="contained" color="primary" onClick={() => { setState({ ...state, addDialogOpen: true }) }}>Create Process</Button>
            </Box>
            <MaterialTable
                columns={columns}
                data={state.processes}
                options={{
                    toolbar: false
                }}
            />
            <DetailsProcessDialog open={state.detailsDialogOpen} close={handleDetailsDialogClose} data={state.selectedData} />
            <AddProcessDialog open={state.addDialogOpen} close={handleAddDialogClose} />
        </div>
    );
};

export default Process;
