import React from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, Chip } from '@material-ui/core';
import { getProcesses } from './requests'

const columns = [
    { title: 'ID', field: 'id', render: (row) => `#${row.id}` },
    { title: 'Name', field: 'name' },
    {
        title: 'Type', field: 'type', lookup: { 1: 'Product', 2: 'Service' },
        render: (row) => <Chip variant="outlined" size="small"
            color={row.type === 1 ? "primary" : "secondary"} label={row.type === 1 ? "Product" : "Service"} />
    }
];

const Products = props => {

    const [processData, setProcessData] = React.useState();
    const [state, setState] = React.useState({
        dialogOpen: false,
        selectedRow: [{}],
    });

    //later on will be processData
    const exampleData = [
        { id: '48309832', name: 'test', type: 1, id1: '222', id2: '333' },
        { id: '48309833', name: 'test2', type: 2, id1: '122', id2: '313' },
    ];

    const handleClose = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, dialogOpen: false });
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
                title={props.title}
                columns={columns}
                data={exampleData}
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
                        <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions >
                </DialogContent>
            </Dialog >
        </div >
    );
}


export default Products;