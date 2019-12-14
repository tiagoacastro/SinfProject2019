import React from 'react';
import MaterialTable from 'material-table';
import { getMappedEntities } from './requests'
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
        setState({ ...state, addDialogOpen: false });
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
            />
            <EntitiesMapDialog open={state.addDialogOpen} close={handleAddClose} />
        </div >
    );
}


export default Entities;