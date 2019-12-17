import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText, Switch, FormControlLabel } from '@material-ui/core';
import MaterialTable from 'material-table';

const AddProcessDialog = props => {

    const { open, close, submit } = props;
    const [state, setState] = React.useState({
        active: true,
        currentFields: [],
        name: '',
    });

    const documents = {
        'Purchase Order': 'Purchase Order',
        'Sales Order': 'Sales Order',
        'Delivery Order': 'Delivery Order',
        'Sales Invoice': 'Sales Invoice',
        'Purchase Invoice': 'Purchase Invoice',
        'Good Receipt': 'Good Receipt',
        'Payment': 'Payment',
        'Payment Receipt': 'Payment Receipt'
    }

    console.log(documents);

    const methods = {
        'Manual': 'Manual',
        'Automatic': 'Automatic',
    }

    const companies = {
        1: 'GrapeVine',
        2: 'WineWard',
    }

    const columns = [
        { title: 'Step', field: 'position', editable: 'never' },
        { title: 'Issuing Company', field: 'issuing_company', lookup: companies },
        { title: 'Document', field: 'document', lookup: documents },
        { title: 'Method', field: 'method', lookup: methods }
    ];

    const handleChange = event => {
        setState({ ...state, active: event.target.checked });
    };

    const handleNameChange = event => {
        setState({ ...state, name: event.target.value });
    };

    function handleSubmit(data) {
        return event => {
            event.preventDefault();
            setState({ ...state, currentFields: [], name: '' })
            submit(data);
        }
    }

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">New Process</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={handleSubmit(state)}>
                        <Box mt={3} mb={6} px={2}>
                            <Grid container justify="flex-start" spacing={2}>
                                <Grid container item xs={3} py={1}>
                                    <TextField required id="name" label="Name" onChange={handleNameChange} value={state.name} />
                                </Grid>
                                <Grid container item xs={3} py={1} justify="flex-start">
                                    <FormControlLabel
                                        control={
                                            <Switch checked={state.active} onChange={handleChange} value="active" />
                                        }
                                        label="Active"
                                    />
                                </Grid>
                            </Grid>
                            <Box my={3}><Divider /></Box>
                            <MaterialTable
                                title="Steps"
                                columns={columns}
                                data={state.currentFields}
                                options={{
                                    search: false,
                                    paging: false
                                }}
                                editable={{
                                    onRowAdd: newData =>
                                        new Promise((resolve, reject) => {
                                            let data = state.currentFields;
                                            newData.position = state.currentFields.length + 1;
                                            if (newData.issuing_company && newData.document && newData.method) {
                                                data.push(newData);
                                                setState({ ...state, currentFields: data });
                                            }

                                            resolve()
                                        }),
                                    onRowDelete: oldData =>
                                        new Promise((resolve, reject) => {
                                            let data = state.currentFields;
                                            const index = data.indexOf(oldData);

                                            for (let i = index + 1; i < state.currentFields.length; i++) {
                                                const oldStep = data[i].position;
                                                data[i].position = oldStep - 1;
                                            }

                                            data.splice(index, 1);
                                            setState({ ...state, currentFields: data });

                                            resolve()
                                        }),
                                }}
                            />
                        </Box>
                        <Box mt={3}><Divider /></Box>
                        <DialogActions>
                            <Button onClick={close}>Close</Button>
                            <Button type='submit'>Create</Button>
                        </DialogActions >
                    </form>
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default AddProcessDialog;