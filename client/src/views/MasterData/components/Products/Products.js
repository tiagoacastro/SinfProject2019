import React from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, Chip } from '@material-ui/core';
import { getMappedProducts, postMappedProducts } from './requests'
import { MapDialog } from '../../components';

const Products = props => {

    const [state, setState] = React.useState({
        detailsDialogOpen: false,
        addDialogOpen: false,
        selectedRow: [{}],
        mappedProducts: [],
    });

    const columns = [
        { title: 'ID', field: 'id', },
        { title: 'Ref WineWard', field: 'reference_1' },
        { title: 'Ref GrapeVine', field: 'reference_2' }
    ];

    const handleDetailsClose = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, detailsDialogOpen: false });
    };

    const handleAddClose = () => {
        setState({ ...state, addDialogOpen: false });
    };

    const handleAddSave = (productA, productB) => {
        //save ids in database and get universal id
        const data = state.data;
        data.push({ id: '1', ref1: productA, ref1: productB })
        setState({ ...state, data, addDialogOpen: false });
    };

    React.useEffect(() => {
        getMappedProducts()
            .then((response) => {
                const data = response.data.mappedProducts;
                setState({ ...state, mappedProducts: data });
            })
            .catch((err) => { });
    }, []);

    return (
        <div>
            <MaterialTable
                title="Products"
                columns={columns}
                data={state.mappedProducts}
                actions={[
                    {
                        icon: 'add',
                        tooltip: 'Add User',
                        isFreeAction: true,
                        onClick: (event) => {
                            setState({ ...state, addDialogOpen: true });
                        }
                    }
                ]}
            />
            <Dialog
                fullWidth
                open={state.detailsDialogOpen}
                aria-labelledby="draggable-dialog-title"
                onClose={handleDetailsClose}
            >
                <DialogTitle id="draggable-dialog-title">Product Information</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box mt={1} mb={3}>
                        <Box mb={2}><small>Details</small></Box>
                        <Box pl={2} py={1}>
                            <Typography><b>Universal ID: </b>{state.selectedRow.id}</Typography>
                            <Typography><b>Product Name: </b>{state.selectedRow.name}</Typography>
                        </Box>
                    </Box>
                    <Divider />
                    <Box mt={3} mb={6}>
                        <Box mb={3}><small>Product Mapping</small></Box>
                        <form noValidate autoComplete="off">
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={6} py={1}>
                                    <TextField InputProps={{ readOnly: true, }} id="winerd-id" label="Winerd" defaultValue={state.selectedRow.id1} />
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <TextField InputProps={{ readOnly: true, }} id="grapevine-id" label="GrapeVine" defaultValue={state.selectedRow.id2} />
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleDetailsClose}>Cancel</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
            <MapDialog open={state.addDialogOpen} close={handleAddClose} save={handleAddSave} />

        </div >
    );
}


export default Products;