export const handleDetailsClose = () => {
    const selectedRow = state.selectedRow
    setState({ ...state, selectedRow: selectedRow, detailsDialogOpen: false });
};

export const handleAddClose = () => {
    setState({ ...state, addDialogOpen: false });
};