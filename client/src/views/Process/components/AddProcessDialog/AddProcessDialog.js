import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText, Switch, FormControlLabel } from '@material-ui/core';
import MaterialTable from 'material-table';

const AddProcessDialog = props => {

    const { open, close, submit, data } = props;
    const [state, setState] = React.useState({
        active: true,
        currentFields: [],
    });

    const columns = [
        { title: 'Step', field: 'position', },
        { title: 'ID', field: 'id', },
        { title: 'Document', field: 'document' },
        { title: 'Method', field: 'method' }

    ];

    const handleChange = name => event => {
        setState({ ...state, active: event.target.checked });
    };

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={true}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">New Process</DialogTitle>
                <Divider />
                <DialogContent>
                    <form>
                        <Box mt={3} mb={6} px={2}>
                            <Grid container justify="flex-start" spacing={2}>
                                <Grid container item xs={3} py={1}>
                                    <TextField required id="name" label="Name" />
                                </Grid>
                                <Grid container item xs={3} py={1} justify="flex-start">
                                    <FormControlLabel
                                        control={
                                            <Switch checked={state.active} onChange={handleChange} value={state.active} />
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
                                            setTimeout(() => {
                                                {
                                                    let data = state.currentFields;
                                                    data.push(newData);
                                                    console.log(data);
                                                    setState({ ...state, currentFields: data });
                                                }
                                                resolve()
                                            }, 1000)
                                        }),
                                    onRowDelete: oldData =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                                {
                                                    let data = state.currentFields;
                                                    const index = data.indexOf(oldData);
                                                    data.splice(index, 1);
                                                    setState({ ...state, currentFields: data });
                                                }
                                                resolve()
                                            }, 1000)
                                        }),
                                }}
                            />
                        </Box>
                        <Box mt={3}><Divider /></Box>
                    </form>

                    <DialogActions>
                        <Button onClick={close}>Close</Button>
                        <Button onClick={close}>Create</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default AddProcessDialog;