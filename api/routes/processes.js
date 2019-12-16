var express = require('express');
var router = express.Router();
var { getClient } = require('../config');
const { getMappedEntities } = require('../utils/requests')

router.get('/', async function (req, res, next) {
    const processes = await getProcesses();
    res.json({ processes: processes });
});

async function getProcesses(companyID, tenant, organization) {
    const client = getClient();
    let processes = []

    try {
        const processesQuery = await client.query('SELECT * FROM processes');
        await asyncForEach(processesQuery.rows, async (process) => {
            const process_events = await client.
                query('SELECT * FROM processes_events INNER JOIN events ON (processes_events.id_event = events.id) WHERE id_process=$1 ORDER BY position'
                    , [process.id]);
            process.events = process_events.rows;
            processes.push(process)
        });

        return processes;

    } catch (err) { console.log(err) }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


module.exports = router;