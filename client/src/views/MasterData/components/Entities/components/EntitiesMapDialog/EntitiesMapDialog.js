import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText } from '@material-ui/core';
import { getSuppliers, getCostumers, postMappedEntities } from './requests';

const EntitiesMapDialog = props => {

    const { open, close, submit } = props;

    const [supplierState, setSupplierState] = React.useState('');
    const [suppliers, setSuppliers] = React.useState([]);

    const [costumerState, setCostumerState] = React.useState('');
    const [costumers, setCostumers] = React.useState([]);

    const [entityTypeState, setEntityTypeState] = React.useState();

    const handleSalesChange = event => {
        setSupplierState(event.target.value);
    };

    const handlePurchaseChange = event => {
        setCostumerState(event.target.value);
    };

    const handleCompany1Change = event => {
        setSupplierState('');
        setSuppliers([]);

        setEntityTypeState(event.target.value);
        let companyID;
        getSuppliers(parseInt(companyID))
            .then((response) => {
                const items = response.data.map(a => JSON.parse(`{"value": "${a}", {"value": "${a}", "label":"${a}"}`));
                setSuppliers(items);

            })
            .catch((err) => { });

        getCostumers(parseInt(companyID))
            .then((response) => {
                console.log(response.data)
                const items = response.data.map(a => JSON.parse(`{"value": "${a}", "label":"${a}"}`));
                setCostumers(items);

            })
            .catch((err) => { });
    };

    const submitForm = (event) => {
        event.preventDefault();
        if (!(entityTypeState === '' || supplierState === '' || costumerState === '')) {
            postMappedEntities(costumerState, supplierState)
                .then((response) => { submit() })
                .catch((err) => { });
        }

        setEntityTypeState('');
        setSupplierState('');
        setCostumerState('');
        setSuppliers([]);
        setCostumers([]);
    }


    const entitiyTypes = [
        { value: '1', label: 'Costumer', },
        { value: '2', label: 'Supplier', }
    ];

    return (
        <div>
            <Dialog
                fullWidth
                open={false}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">Map Entities</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={submitForm}>
                        <Box mt={3} mb={6}>
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={12} py={1}>
                                    <Grid container justify="center">
                                        <Box mb={1}><Typography>Entity Type</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <FormControl required>
                                            <TextField id="select-company-A" select label="Select" value={entityTypeState} onChange={handleCompany1Change} helperText="Please select a company">
                                                {entitiyTypes.map(option => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>REF to GrapeVine</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={supplierState} onChange={handleSalesChange} helperText="Please select a sales item">
                                            {suppliers.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>REF to Wineward</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={costumerState} onChange={handlePurchaseChange} helperText="Please select a sales item">
                                            {costumers.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <DialogActions>
                            <Button onClick={close}>Cancel</Button>
                            <Button onClick={close} type="submit">Save</Button>
                        </DialogActions >
                    </form>
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default EntitiesMapDialog;