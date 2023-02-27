// const launches = new Map()
const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo')
const DEFAULT_FLIGHT_NUMBER = 1

const launch = {
    flightNumber: 1,
    rocket: "Falcon 9",
    mission: "Get Back",
    launchDate: new Date("May 05, 2031"),
    target: "Kepler-442 b",
    customer: ["Lego movie", "Nasa and friends"],
    upcoming: true,
    success: true,
}
// launches.set(launch.flightNumber, launch)

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB
        .findOne()
        .sort('-flightNumber')
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

saveLaunch(launch)

async function existsLaunchWithId(launchId) {

    return await launchesDB.findOne({ flightNumber: launchId })
}

async function getAllLaunches() {
    return await launchesDB.find({}, '-_id -__v')
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target }, '-_id -__v')
    if (!planet) {
        throw new Error('No matching planet was found')
    }
    return await launchesDB.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true,
        }
    )

}
async function addNewLaunch(launch) {
    let latestFlightNumber = await getLatestFlightNumber()
    latestFlightNumber++

    // launches.set(latestFlightNumber, Object.assign(launch, {
    //     success: true,
    //     upcoming: true,
    //     customers: ['my dreams', 'something else'],
    //     flightNumber: latestFlightNumber,
    // }))
    return await saveLaunch(Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['my dreams', 'something else'],
        flightNumber: latestFlightNumber,
    }))

}

async function abortLaunch(launchId) {
    // const aborted = launches.get(launchId)
    const aborted = await launchesDB.updateOne(
        { flightNumber: launchId },
        {
            upcoming: false,
            success: false,
        }
    )
    return aborted.modifiedCount === 1
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId
}
