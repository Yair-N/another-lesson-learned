const path = require('path')
const fs = require('fs')
const { parse } = require('csv-parse')

const planets = require('./planets.mongo');
// const habitablePlanets = []

const kepler_data = path.join(__dirname, '../data/kepler_data.csv')


function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        &&
        planet['koi_insol'] > .36 && planet['koi_insol'] < 1.11
        &&
        planet['koi_prad'] < 1.6
}

/*
const promise = new Promise((resolve, reject)=>{
    resolve('response value')
})


promise.then((result)=>{
    some callback
})

or 

const result = await promise
*/

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(kepler_data)
            .pipe(
                parse(
                    {
                        comment: '#',
                        columns: true,
                    }
                )
            ).on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    // insert+update = upsert
                    await savePlanet(data)
                };
            }).on('error', (err) => {
                console.log(err)
                reject(err)
            }).on('end', async () => {
                const countPlanets = (await getAllPlanets()).length
                console.log(`we found ${countPlanets} planets`);
                resolve()
            })
    }
    )
}



async function getAllPlanets() {
    // return habitablePlanets
    return await planets.find({}, '-_id -__v')
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        })
    } catch (err) {
        console.error(`could not save planet, error:${err}`)
    }
}
module.exports = {
    getAllPlanets,
    loadPlanetsData,
}