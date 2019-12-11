import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem } from '@material-ui/core';

const MapDialog = props => {

    const { open, close, save } = props;

    const [selectAstate, setSelectAstate] = React.useState('1');
    const [selectBstate, setSelectBstate] = React.useState('2');

    const handleAChange = event => {
        setSelectAstate(event.target.value);
    };

    const handleBChange = event => {
        setSelectBstate(event.target.value);
    };

    const company1Products = [
        { value: '1', label: '#1 Name Product A', },
        { value: '2', label: '#2 Name Product B', },
        { value: '3', label: '#3 Name Product C', },
        { value: '4', label: '#4 Name Product D', },
    ];

    const company2Products = [
        { value: '1', label: '#1 Name Product A', },
        { value: '2', label: '#2 Name Product B', },
        { value: '3', label: '#3 Name Product C', },
        { value: '4', label: '#4 Name Product D', },
    ];

    return (
        <div>
            <Dialog
                fullWidth
                open={open}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">Map Products</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box mt={3} mb={6}>
                        <form noValidate autoComplete="off">
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mb={1}><Typography>WinweWard</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField id="select-company-A" select label="Select" value={selectAstate} onChange={handleAChange} helperText="Please select a product">
                                            {company1Products.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mb={1}><Typography>GrapeVine</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField id="select-company-A" select label="Select" value={selectBstate} onChange={handleBChange} helperText="Please select a product">
                                            {company2Products.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Divider />
                    <DialogActions>
                        <Button onClick={close}>Cancel</Button>
                        <Button onClick={() => save(selectAstate, selectBstate)}>Save</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default MapDialog;