import React from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, Chip } from '@material-ui/core';
import { getProcesses } from './requests'
import { MapDialog } from '../../components';

const Products = props => {

    const [processData, setProcessData] = React.useState();
    const [state, setState] = React.useState({
        detailsDialogOpen: false,
        addDialogOpen: false,
        selectedRow: [{}],
        //later on will be processData
        data: [
            { id: '48309832', name: 'test', id1: '222', id2: '333' },
            { id: '48309833', name: 'test2', id1: '122', id2: '313' },
        ],
    });

    const columns = [
        {
            title: 'ID', field: 'id',
            render: (row) =>
                <Button onClick={() => { setState({ ...state, selectedRow: row, detailsDialogOpen: true }); }}>
                    {`#${row.id}`}
                </Button >
        },
        { title: 'Name', field: 'name' }
    ];

    const handleDetailsClose = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, detailsDialogOpen: false });
    };

    const handleAddClose = () => {
        setState({ ...state, addDialogOpen: false });
    };

    const handleAddSave = (idProductA, idProductB) => {
        //save ids in database and get universal id
        const data = state.data;
        data.push({ id: '1', name: 'test2', id1: '122', id2: '313' })
        setState({ ...state, data, addDialogOpen: false });
    };

    React.useEffect(() => {
        getProcesses()
            .then((response) => {
                setProcessData(response.data.products);
            })
            .catch((err) => { });
    }, []);

    return (
        <div>
            <MaterialTable
                title="Products"
                columns={columns}
                data={state.data}
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