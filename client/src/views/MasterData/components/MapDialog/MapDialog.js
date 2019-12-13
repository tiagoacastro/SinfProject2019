import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText } from '@material-ui/core';
import { getSalesItems, getPurchaseItems, postMappedProducts } from './requests';

const MapDialog = props => {

    const { open, close, save } = props;

    const [salesState, setSalesState] = React.useState('');
    const [salesItems, setSalesItems] = React.useState([]);

    const [purchaseState, setPurchaseState] = React.useState('');
    const [purchaseItems, setPurchaseItems] = React.useState([]);

    const [company1State, setCompany1State] = React.useState('');
    const [company2State, setCompany2State] = React.useState('');

    const handleSalesChange = event => {
        setSalesState(event.target.value);
    };

    const handlePurchaseChange = event => {
        setPurchaseState(event.target.value);
    };

    const handleCompany1Change = event => {
        setSalesState('');
        setSalesItems([]);

        setCompany1State(event.target.value);
        handleCompany2Change(event.target.value);

        getSalesItems(parseInt(event.target.value))
            .then((response) => {
                const items = response.data.map(a => JSON.parse(`{"value": "${a}", "label":"${a}"}`));
                setSalesItems(items);

            })
            .catch((err) => { });
    };

    const handleCompany2Change = (idCompany1) => {
        setPurchaseState('');
        setPurchaseItems([]);
        let idCompany2;

        if (idCompany1 === '1') {
            setCompany2State("WineWard");
            idCompany2 = 2;
        }
        else {
            setCompany2State("GrapeVine");
            idCompany2 = 1;
        }

        getPurchaseItems(idCompany2)
            .then((response) => {
                const items = response.data.map(a => JSON.parse(`{"value": "${a}", "label":"${a}"}`));
                setPurchaseItems(items);

            })
            .catch((err) => { });

    };

    const submitForm = (event) => {
        event.preventDefault();
        if (!(company1State == '' || company2State == '' || salesState == '' || purchaseState == '')) {
            if (company1State == '1') {
                console.log(postMappedProducts(salesState, purchaseState));
            } else postMappedProducts(purchaseState, salesState);
        }

        setCompany1State('');
        setCompany2State('');
        setSalesState('');
        setPurchaseState('');
        setSalesItems([]);
        setPurchaseItems([]);
    }


    const companies = [
        { value: '1', label: 'GrapeVine', },
        { value: '2', label: 'WineWard', }
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
                    <form onSubmit={submitForm}>
                        <Box mt={3} mb={6}>
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mb={1}><Typography>Supplying Company</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <FormControl required>
                                            <TextField id="select-company-A" select label="Select" value={company1State} onChange={handleCompany1Change} helperText="Please select a company">
                                                {companies.map(option => (
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
                                        <Box mb={1}><Typography>Purchasing Company</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <FormControl disabled>
                                            <NativeSelect value={company2State} >
                                                <option value={company2State}>{company2State}</option>
                                            </NativeSelect>
                                            <FormHelperText>To be changed automatically</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>Sales Item</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={salesState} onChange={handleSalesChange} helperText="Please select a sales item">
                                            {salesItems.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>Purchase Item</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={purchaseState} onChange={handlePurchaseChange} helperText="Please select a sales item">
                                            {purchaseItems.map(option => (
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


export default MapDialog;