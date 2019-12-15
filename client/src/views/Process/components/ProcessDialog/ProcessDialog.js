import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl, FormHelperText } from '@material-ui/core';
import { getSuppliers, getCostumers, postMappedEntities } from './requests';
import MaterialTable from 'material-table';

const ProcessDialog = props => {

    const { open, close, submit } = props;

    const [supplierState, setSupplierState] = React.useState('');
    const [suppliers, setSuppliers] = React.useState([]);

    const [costumerState, setCostumerState] = React.useState('');
    const [costumers, setCostumers] = React.useState([]);

    const [entityTypeState, setEntityTypeState] = React.useState();

    const columns = [
        { title: 'ID', field: 'id', },
        { title: 'Name', field: 'name' },
        { title: 'Active', field: 'active', type: 'boolean' },
        { title: 'N Steps', field: 'steps' },
    ];

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
                open={open}
                aria-labelledby="draggable-dialog-title"
                onClose={close}
            >
                <DialogTitle id="draggable-dialog-title">Process #1</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box mt={3} mb={6}>
                        <Grid container justify="center">
                            <Grid container justify="center" item xs={12} py={1}>
                                Name: coiso
                    state: active
                            </Grid>
                        </Grid>
                        <Divider />
                        <MaterialTable
                            columns={columns}
                            data={[]}
                            options={{
                                toolbar: false,
                                paging: false
                            }}
                        />
                    </Box>
                    <Divider />
                    <DialogActions>
                        <Button onClick={close}>Cancel</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default ProcessDialog;