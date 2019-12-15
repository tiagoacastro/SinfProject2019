import React from 'react';
import MaterialTable from 'material-table';
import { EntitiesMapDialog } from './components';
import { Select, MenuItem } from '@material-ui/core';
import {
    getMappedEntities,
    deleteMappedEntities,
    postMappedEntities,
    getCustomerReferences,
    getSupplierReferences
} from './requests'

const Entities = () => {

    const [entitiesData, setEntitiesData] = React.useState([]);

    const [columns, setColumns] = React.useState([
        { title: 'Entity Type', field: 'category', editable: 'never' },
        {
            title: 'REFs to Grapevine', field: 'reference_1',
            editComponent: props => {
                return <Select value={props.value} onChange={e => props.onChange(e.target.value)}>
                    {
                        props.rowData.category === 'Customer_Entity' ? state.ref_1CostumerOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )) : state.ref_1SupplierOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))
                    }
                </Select>
            }
        },
        {
            title: 'REFs to Wineward', field: 'reference_2',
            editComponent: props => {
                return <Select value={props.value} onChange={e => props.onChange(e.target.value)}>
                    {
                        props.rowData.category === 'Customer_Entity' ? state.ref_1CostumerOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )) : state.ref_1SupplierOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))
                    }
                </Select>
            }
        }])

    const [state, setState] = React.useState({
        coisa: [],
        ref_1CostumerOptions: [],
        ref_1SupplierOptions: [],
        ref_2CostumerOptions: [],
        ref_2SupplierOptions: [],
    });

    const handleAddClose = () => {
        getMappedEntities()
            .then((response) => {
                console.log(response)
                const data = response.data.mappedEntities;
                setEntitiesData(data);
            })
            .catch((err) => { });
    };

    React.useEffect(() => {

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

        getCustomerReferences()
            .then((response) => {
                const ref_1CostumerOptions = response.options_1;
                const ref_2CostumerOptions = response.options_2;
                setState({ ...state, ref_1CostumerOptions: ref_1CostumerOptions, ref_2CostumerOptions: ref_2CostumerOptions });
            }).catch((err) => { });

        getSupplierReferences().then((response) => {
            const ref_1SupplierOptions = response.options_1;
            const ref_2SupplierOptions = response.options_2;
            setState({ ...state, ref_1SupplierOptions, ref_2SupplierOptions });
        }).catch((err) => { });

    }, []);

    return (
        <div>
            <MaterialTable
                title="Entities"
                columns={columns}
                data={entitiesData}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = entitiesData;
                                    const index = data.indexOf(oldData);
                                    data[index] = newData;
                                    setEntitiesData(data, () => resolve());

                                    postMappedEntities(newData.category, newData.reference_1, newData.reference_2)
                                        .then((response) => { })
                                        .catch((err) => { });

                                    resolve();
                                }
                            }, 1000);
                        }),

                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = state.entitiesData;
                                    const index = data.indexOf(oldData);
                                    data.splice(index, 1);
                                    data.push({ category: oldData.category })
                                    setEntitiesData(data, () => resolve());

                                    deleteMappedEntities(oldData.id)
                                        .then((response) => { })
                                        .catch((err) => { });
                                }
                                resolve()
                            }, 1000)
                        }),
                }}
            />
            <EntitiesMapDialog open={state.addDialogOpen} close={handleAddClose} submit={() => {
                getMappedEntities()
                    .then((response) => {
                        const data = response.data.mappedEntities;
                        setEntitiesData(data);
                    })
                    .catch((err) => { });
            }} />
        </div >
    );
}


export default Entities;