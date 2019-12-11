import React from 'react';
import MaterialTable from 'material-table';
import { Chip } from '@material-ui/core';
import { getClients } from './requests'

const Entities = props => {

    const [entitiesData, setEntetiesData] = React.useState();
    const [state, setState] = React.useState({
        dialogOpen: false,
        selectedRow: [{}],
    });

    const columns = [
        { title: 'ID', field: 'id' },
        { title: 'Name', field: 'name' },
        { title: 'ClientID', field: 'clientid' },
        { title: 'SupplierID', field: 'supplierid' }
    ];

    //later on will be processData
    const exampleData = [
        { id: '1', name: 'WineWard', clientid: 'C01', supplierid: 'F04' },
        { id: '2', name: 'GrapeVine', clientid: 'C03', supplierid: 'F10' },
    ];

    const handleClose = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, dialogOpen: false });
    };

    const handleOpen = () => {
        const selectedRow = state.selectedRow
        setState({ ...state, selectedRow: selectedRow, dialogOpen: false });
    };

    React.useEffect(() => {
        getClients()
            .then((response) => {
                setEntetiesData(response.data);
            })
            .catch((err) => { });
    }, []);

    return (
        <div>
            <MaterialTable
                title="Entities"
                columns={columns}
                data={exampleData}
                options={{
                    search: false,
                    paging: false
                }}
            />
        </div >
    );
}


export default Entities;