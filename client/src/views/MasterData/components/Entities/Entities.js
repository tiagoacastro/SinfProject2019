import React from 'react';
import MaterialTable from 'material-table';
import { getMappedEntities, deleteMappedEntities } from './requests'
import { EntitiesMapDialog } from './components';

const Entities = () => {

    const [state, setState] = React.useState({
        addDialogOpen: false,
        entitiesData: [],
    });

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'REF Client', field: 'reference_1' },
        { title: 'REF Supplier', field: 'reference_2' }
    ];

    const handleAddClose = () => {
        console.log("oioioioi")
        getMappedEntities()
            .then((response) => {
                console.log(response)
                const data = response.data.mappedEntities;
                setState({ ...state, entitiesData: data, addDialogOpen: false });
            })
            .catch((err) => { });
    };

    React.useEffect(() => {
        getMappedEntities()
            .then((response) => {
                const data = response.data.mappedEntities;
                setState({ ...state, entitiesData: data });
            })
            .catch((err) => { });
    }, []);

    return (
        <div>
            <MaterialTable
                title="Entities"
                columns={columns}
                data={state.entitiesData}
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
                                    deleteMappedEntities(oldData.id)
                                        .then((response) => {
                                            getMappedEntities()
                                                .then((response) => {
                                                    const data = response.data.mappedEntities;
                                                    setState({ ...state, entitiesData: data, addDialogOpen: false });
                                                })
                                                .catch((err) => { });
                                        })
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
                    setState({ ...state, entitiesData: data, addDialogOpen: false });
                })
                .catch((err) => { });
            }} />
        </div >
    );
}


export default Entities;