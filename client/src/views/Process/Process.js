import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getProcesses } from './requests';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Process = () => {
    const classes = useStyles();

    React.useEffect(() => {
        getProcesses()
            .then((response) => {
                const data = response.data.processes;
                console.log(data)
            })
            .catch((err) => { });
    }, []);

    return (
        <div className={classes.root}>
        </div>
    );
};

export default Process;
