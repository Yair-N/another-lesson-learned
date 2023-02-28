const axios = require('axios')
// const launches = new Map()

const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 1

const SPACEX_API_URL = `https://api.spacexdata.com/v4/launches/query`

// const launch = {
//     flightNumber: 1, //flight_number
//     rocket: "Falcon 9", // rocket.name
//     mission: "Get Back", //name
//     launchDate: new Date("May 05, 2031"), //date_utc
//     target: "Kepler-442 b",
//     customer: ["Lego movie", "Nasa and friends"],
//     upcoming: true, //upcoming
//     success: true, //success
// }
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


async function findLaunch(filter) {
    return await launchesDB.findOne(filter)
}


async function populateLaunchData() {

    console.log('Loading SpaceX Data')

    const requestOptions = {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    // strictPopulate: false,

                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    strictPopulate: false,
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    }

    const response = await axios.post(SPACEX_API_URL, requestOptions)

    const launchDocs = response.data.docs
    if (response.status !== 200) {
        console.log('Problem downloading data from spaceX')
        throw new Error('Launch data download failed')
    }
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {

            return payload.customers
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            rocket: launchDoc['rocket']['name'], // rocket.name
            mission: launchDoc['name'], //name
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'], //upcoming
            success: launchDoc['success'], //success
            customers,
        }

        saveLaunch(launch)
    }


}

async function existsLaunchWithId(launchId) {

    return await findLaunch({ flightNumber: launchId })
}

async function loadLaunchData() {

    if (await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1'
    })) { console.log('Launch data already loaded!') }
    else { populateLaunchData() }
}

async function getAllLaunches(skip, limit) {
    return await launchesDB
        .find({}, '-_id -__v')
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}

async function saveLaunch(launch) {

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
    const planet = await planets.findOne({ keplerName: launch.target }, '-_id -__v')
    if (!planet) {
        throw new Error('No matching planet was found')
    }
    let latestFlightNumber = await getLatestFlightNumber()
    latestFlightNumber++

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
    existsLaunchWithId,
    loadLaunchData
}
