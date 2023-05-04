const {
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId,
} = require('../../models/launches.model.js')

const {
    getPagination,
} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {

    const launch = req.body

    // validation
    if (!launch.mission || !launch.launchDate || !launch.rocket || !launch.target) {
        return res.status(400).json(
            { error: 'Missing required launch property' }
        )
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date' })
    }
    await addNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    if (!await existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }
    const aborted = await abortLaunch(launchId)
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }
    return res.status(202).json({ ok: true })

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}