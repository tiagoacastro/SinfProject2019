import React from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography } from '@material-ui/core';
import { Grid, Divider, Box, Button, TextField, Chip } from '@material-ui/core';
import { getMappedProducts, postMappedProducts } from './requests'
import { MapDialog } from '../../components';

const Products = props => {

    const [state, setState] = React.useState({
        addDialogOpen: false,
        selectedRow: [{}],
        mappedProducts: [],
    });

    const columns = [
        { title: 'ID', field: 'id', },
        { title: 'Ref WineWard', field: 'reference_1' },
        { title: 'Ref GrapeVine', field: 'reference_2' }
    ];

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
            <MapDialog open={state.addDialogOpen} close={handleAddClose} save={handleAddSave} />

        </div >
    );
}


export default Products;