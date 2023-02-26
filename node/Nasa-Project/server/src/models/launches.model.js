const launches = new Map() // require('./launches.mongo')


const launch = {
    flightNumber: 1,
    rocket: "",
    number: "",
    launchDate: new Date("May 05, 2022"),
    target: "",
    customer: [],
    upcoming: true,
    success: true,
}
launches.set(launch.flightNumber, launch)

let latestFlightNumber = Array.from(launches.values()).length


function existsLaunchWithId(launchId) {
    return launches.has(launchId)
}

function getAllLaunches() {
    return Array.from(launches.values())

}

function addNewLaunch(launch) {
    latestFlightNumber++
    launches.set(latestFlightNumber, Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['my dreams', 'something else'],
        flightNumber: latestFlightNumber,
    }))
}

function abortLaunch(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunch,
    existsLaunchWithId
}
