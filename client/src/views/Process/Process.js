import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getProcesses, postProcesses } from './requests';
import MaterialTable from 'material-table';
import { Button, Box, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
        snackBarOpen: false,
        createdProcess: null,
        snackMessage: '',
    });

    const handleDetailsDialogClose = () => {
        setState({ ...state, detailsDialogOpen: false });
    };

    const handleAddDialogClose = () => {
        setState({ ...state, addDialogOpen: false });
    };

    const handleDialogOpen = row => {
        setState({ ...state, detailsDialogOpen: true, selectedData: row });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setState({ ...state, snackBarOpen: false });
    };

    React.useEffect(() => {
        getProcesses()
            .then((response) => {
                let data = response.data.processes;
                data.forEach(process => {
                    process.steps = process.events.length
                });
                setState({ ...state, processes: data })
            })
            .catch((err) => { });
    }, []);

    const columns = [
        {
            title: 'ID', field: 'id', editable: 'never',
            render: (row) => {
                return <Button variant="outlined"
                    onClick={() => handleDialogOpen(row)}
                > {row.id}</Button >
            }
        },
        { title: 'Name', field: 'name', editable: 'never' },
        { title: 'Active', field: 'active', type: 'boolean' },
        { title: 'N Steps', field: 'steps', editable: 'never' },
    ];


    const handleSubmit = data => {
        if (data.currentFields.length <= 0) {
            setState({ ...state, snackBarOpen: true, snackMessage: 'Process must have at least one step.' })
            return;
        }
        setState({ ...state, addDialogOpen: false });
        let process = { name: data.name, events: [] };
        data.currentFields.forEach(eventData => {
            process.events.push({
                issuing_company: eventData.issuing_company,
                document: eventData.document,
                method: eventData.method,
                position: eventData.position
            });
        });

        postProcesses(process);
    }

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
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                            if (oldData) {
                                setState(prevState => {
                                    const processes = [...prevState.processes];
                                    processes[processes.indexOf(oldData)] = newData;
                                    return { ...prevState, processes };
                                });
                            }
                            resolve();
                        })
                }}
            />
            <DetailsProcessDialog open={state.detailsDialogOpen} close={handleDetailsDialogClose} data={state.selectedData} />
            <AddProcessDialog open={state.addDialogOpen} close={handleAddDialogClose} submit={handleSubmit} />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={state.snackBarOpen}
                autoHideDuration={2000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{state.snackMessage}</span>}
                action={[

                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </div>
    );
};

export default Process;
