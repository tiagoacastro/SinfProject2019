import React from 'react';
import MaterialTable from 'material-table';
import { getMappedProducts, deleteMappedProducts } from './requests'
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

    const handleAddClose = async function () {
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
                editable={{
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    deleteMappedProducts(oldData.id)
                                        .then(() => {
                                            getMappedProducts()
                                                .then((response) => {
                                                    const data = response.data.mappedProducts;
                                                    setState({ ...state, mappedProducts: data, addDialogOpen: false });
                                                })
                                                .catch((err) => { });
                                        }).catch((err) => { });
                                }
                                resolve()
                            }, 1000)
                        }),
                }}
            />
            <ProductMapDialog open={state.addDialogOpen} close={handleAddClose} submit={() => {
                getMappedProducts()
                .then((response) => {
                    const data = response.data.mappedProducts;
                    setState({ ...state, mappedProducts: data });
                })
                .catch((err) => { });
            }} />

        </div >
    );
}


export default Products;