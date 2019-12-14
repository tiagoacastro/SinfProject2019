import React from 'react';
import MaterialTable from 'material-table';
import { getMappedProducts } from './requests'
import { ProductMapDialog } from './components';

const Products = () => {

    const [state, setState] = React.useState({
        addDialogOpen: false,
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
            <ProductMapDialog open={state.addDialogOpen} close={handleAddClose} />

        </div >
    );
}


export default Products;