import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText } from '@material-ui/core';
import MaterialTable from 'material-table';

const DetailsProcessDialog = props => {

    const { open, close, submit, data } = props;

    const columns = [
        { title: 'Step', field: 'position', },
        { title: 'ID', field: 'id', },
        { title: 'Document', field: 'document' },
        { title: 'Method', field: 'method' }

    ];

    return (
        <div>
            <Dialog
                fullWidth
                open={open}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">Process #{data.id}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box mt={3} mb={6} px={1}>
                        <Box mb={3}>
                            <Grid container justify="center" spacing={2}>
                                <Grid container item xs={12} py={1}>
                                    <b>Name: </b> {data.name}
                                </Grid>
                                <Grid container item xs={12} py={1}>
                                    <b>State: </b> active
                            </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <MaterialTable
                                columns={columns}
                                data={data.events}
                                options={{
                                    toolbar: false,
                                    paging: false
                                }}
                            />
                        </Box>
                    </Box>
                    <Divider />
                    <DialogActions>
                        <Button onClick={close}>Close</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default DetailsProcessDialog;