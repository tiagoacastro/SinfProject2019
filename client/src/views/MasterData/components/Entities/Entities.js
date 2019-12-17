import React from 'react';
import MaterialTable from 'material-table';
import { Grid, Divider, Box, Button, TextField, MenuItem, NativeSelect, FormControl } from '@material-ui/core';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import {
    getMappedEntities,
    deleteMappedEntities,
    postMappedEntities,
    getCustomerReferences,
    getSupplierReferences
} from './requests'

const Entities = () => {

    const [entitiesData, setEntitiesData] = React.useState([]);
    const [state, setState] = React.useState({
        addDialogOpen: false,
        selectedRow: [],
        ref_1CostumerOptions: [],
        ref_1SupplierOptions: [],
        ref_2CostumerOptions: [],
        ref_2SupplierOptions: [],
        references1: [],
        reference1State: '',
        references2: [],
        reference2State: ''
    });

    const columns = [
        {
            title: 'Entity Type', field: 'category', editable: 'never',
            lookup:
                { 'Customer_Entity': 'Customer', 'Supplier_Entity': 'Supplier', },
        },
        { title: 'REFs to Grapevine', field: 'reference_1', },
        { title: 'REFs to Wineward', field: 'reference_2', }
    ]

    const handleRef1Change = event => {
        setState({ ...state, reference1State: event.target.value });
    };

    const handleRef2Change = event => {
        setState({ ...state, reference2State: event.target.value });
    };

    const getOptions = async (category) => {
        let options = {};

        if (category === 'Customer_Entity') {
            options = await getCustomerReferences();
        }
        else {
            options = await getSupplierReferences();
        }

        return options;
    }

    const handleAddClose = () => {
        setState({ ...state, addDialogOpen: false })
    }

    const mappedEntitites = () => {
        getMappedEntities()
            .then((response) => {
                const data = response.data.mappedEntities;

                if (data.length === 0)
                    data.push({ category: 'Customer_Entity' }, { category: 'Supplier_Entity' });
                else if (data.length === 1 && data[0].category === 'Customer_Entity')
                    data.push({ category: 'Supplier_Entity' });
                else if (data.length === 1 && data[0].category === 'Supplier_Entity')
                    data.unshift({ category: 'Costumer_Entity' });

                setEntitiesData(data);

            })
            .catch((err) => { });
    }

    React.useEffect(() => {

        mappedEntitites();

    }, []);

    const submit = event => {
        event.preventDefault();
        postMappedEntities(state.selectedRow.category, state.reference1State, state.reference2State)
            .then(mappedEntitites)
            .catch((err) => { });
    }

    return (
        <div>
            <MaterialTable
                title="Entities"
                columns={columns}
                data={entitiesData}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit',
                        onClick: async (event, rowData) => {
                            setState({ ...state, addDialogOpen: true, selectedRow: rowData });
                            const options = await getOptions(rowData.category);
                            setState({ ...state, addDialogOpen: true, selectedRow: rowData, references1: options.options_1, references2: options.options_2 });
                        }
                    }
                ]}
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            const data = entitiesData;
                            const index = data.indexOf(oldData);
                            data.splice(index, 1);
                            data.push({ category: oldData.category })
                            setEntitiesData(data);

                            deleteMappedEntities(oldData.id)
                                .then((response) => { })
                                .catch((err) => { });

                            resolve()
                        }),
                }}
            />
            <Dialog
                fullWidth
                open={state.addDialogOpen}
                aria-labelledby="draggable-dialog-title"
                onClose={handleAddClose}
            >
                <DialogTitle id="draggable-dialog-title">Map Entities</DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={submit}>
                        <Box mt={3} mb={6}>
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={12} py={1}>
                                    <Grid container>
                                        <Box mb={1}><Typography>Entity Type</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <FormControl disabled>
                                            <NativeSelect value={state.selectedRow.category} >
                                                <option value={state.selectedRow.category}>{state.selectedRow.category}</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>REF to GrapeVine</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={state.reference1State} onChange={handleRef1Change} helperText="Please select a reference">
                                            {
                                                state.references1.map(option => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))
                                            }
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <Grid container justify="center">
                                        <Box mt={4} mb={1}><Typography>REF to Wineward</Typography></Box>
                                    </Grid>
                                    <Grid container justify="center">
                                        <TextField required id="select-company-A" select label="Select" value={state.reference2State} onChange={handleRef2Change} helperText="Please select a reference">
                                            {state.references2.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <DialogActions>
                            <Button onClick={handleAddClose}>Cancel</Button>
                            <Button onClick={handleAddClose} type="submit">Save</Button>
                        </DialogActions >
                    </form>
                </DialogContent>
            </Dialog >

        </div >
    );
}

export default Entities;