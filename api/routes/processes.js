var express = require('express');
var router = express.Router();
var { getClient } = require('../config');
const { getMappedEntities } = require('../utils/requests')

router.get('/', async function (req, res, next) {
    const processes = await getProcesses();
    res.json({ processes: processes });
});

router.post('/disable', async function (req, res, next) {
    const process_id = req.body.id_process;
    try {
        const processes = await updateProcess(process_id);
        res.sendStatus(200);
    }
    catch (e) {
        res.sendStatus(400);
    }

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

router.post('/create', async function (req, res, next) {
    const process_name = req.body.process.name;
    const events = req.body.process.events;
    const process_id = await createProcess(process_name);
    console.log(process_id);
    createEvents(process_id, events);
});

async function createProcess(name) {
    const client = getClient();
    const process_id = await client.query('INSERT INTO processes (name) VALUES ($1) RETURNING id', [name]);
    return process_id.rows[0].id;
}

function updateProcess(id_process, active) {
    const client = getClient();
    return client.query('UPDATE processes SET active=$1 WHERE id=$2', [active, id_process]);
}

async function createEvents(process_id, events) {
    const client = getClient();
    let event_id;

    await asyncForEach(events, async (event) => {
        event_id = await client
            .query('INSERT INTO events (document, method, issuing_company) VALUES ($1, $2, $3) RETURNING id',
                [event.document, event.method, event.issuing_company]);
        event_id = event_id.rows[0].id;
        await client
            .query('INSERT INTO processes_events (id_process, id_event, position) VALUES ($1, $2, $3)',
                [process_id, event_id, event.position]);
    });
}

module.exports = router;