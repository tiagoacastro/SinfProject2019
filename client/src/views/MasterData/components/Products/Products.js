import React from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, Chip } from '@material-ui/core';

const Products = props => {

    const [state, setState] = React.useState({
        columns: [
            { title: 'ID', field: 'id', render: (row) => `#${row.id}` },
            { title: 'Name', field: 'name' },
            { title: 'Company', field: 'company', lookup: { 1: 'Company1', 2: 'Company2' } },
            { title: 'Quantity', field: 'quantity' },
            {
                title: 'Type', field: 'type', lookup: { 1: 'Product', 2: 'Service' },
                render: (row) => <Chip variant="outlined" size="small"
                    color={row.type === 1 ? "primary" : "secondary"} label={row.type === 1 ? "Product" : "Service"} />
            }
        ],
        data: [
            { id: '48309832', name: 'test', company: 1, quantity: 1987, type: 1 },
            { id: '48309833', name: 'test2', company: 2, quantity: 17, type: 2 },
        ],
        dialogOpen: false,
        selectedRow: [{}],
    });

    const handleClose = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, dialogOpen: false });
    };

    return (
        <div>
            <MaterialTable
                title={props.title}
                columns={state.columns}
                data={state.data}
                actions={[
                    {
                        icon: 'edit',
                        onClick: (_, rowData) => {
                            setState({ ...state, selectedRow: rowData, dialogOpen: true });
                        }
                    }
                ]}
            />
            <Dialog
                fullWidth
                open={state.dialogOpen}
                aria-labelledby="draggable-dialog-title"
                onClose={handleClose}
            >
                <DialogTitle id="draggable-dialog-title">Product Information</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box mt={1} mb={3}>
                        <Box mb={2}><small>Details</small></Box>
                        <Box pl={2} py={1}>
                            <b>Product Name: </b>
                            {state.selectedRow.name}
                        </Box>
                        <Box pl={2} py={1}>
                            <b>Company: </b>
                            {state.columns[2].lookup[state.selectedRow.company]}
                        </Box>
                    </Box>
                    <Divider />
                    <Box mt={3} mb={6}>
                        <Box mb={3}><small>Product Mapping</small></Box>
                        <form noValidate autoComplete="off">
                            <Grid container justify="center">
                                <Grid container justify="center" item xs={6} py={1}>
                                    <TextField id="winerd-id" label="Winerd" defaultValue="cenas (?)" />
                                </Grid>
                                <Grid container justify="center" item xs={6} py={1}>
                                    <TextField id="grapevine-id" label="GrapeVine" defaultValue="cenas (?)" />
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose} color="primary">Save</Button>
                    </DialogActions >

                </DialogContent>
            </Dialog >
        </div >
    );
}


export default Products;