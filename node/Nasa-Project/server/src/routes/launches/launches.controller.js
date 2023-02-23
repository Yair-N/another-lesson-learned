const {
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId,
} = require('../../models/launches.model.js')


function httpGetAllLaunches(req, res) {
    return res.status(200).json((getAllLaunches()))
}

function httpAddNewLaunch(req, res) {

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
    addNewLaunch(launch)
    return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)
    console.log(launchId)
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }
    const aborted = abortLaunch(launchId)
    return res.status(202).json(aborted)

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}