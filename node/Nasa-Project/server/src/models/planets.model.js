const path = require('path')
const fs = require('fs')
const { parse } = require('csv-parse');

const kepler_data = path.join(__dirname, '../data/kepler_data.csv')

const habitablePlanets = [];

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
            ).on('data', (data) => {
                isHabitablePlanet(data) && habitablePlanets.push(data);
            }).on('error', (err) => {
                console.log(err)
                reject(err)
            }).on('end', () => {
                console.log(`we found ${habitablePlanets.length} planets`);
                resolve()
            })
    }
    )
}


module.exports = {
    planets: habitablePlanets,
    loadPlanetsData,
}