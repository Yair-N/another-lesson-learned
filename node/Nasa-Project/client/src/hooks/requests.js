const PORT = 8000
const API_VERSION = 'v1'

// uncomment API URL by environment 
const API_URL = `http://localhost:${PORT}/${API_VERSION}` // for dev
// const API_URL = API_VERSION // for docker
// Load planets and return as JSON.
async function httpGetPlanets() {
  // TODO: Once API is ready. - DONE
  const response = await fetch(`${API_URL}/planets`)
  return await response.json()
}
// Load launches, sort by flight number, and return as JSON.

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchLaunches = await response.json()
  return fetchLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(launch),
      })
  } catch (err) {
    return {
      ok: false,
    }
  }

}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`,
      {
        method: "delete",
      })
  } catch (err) {
    return {
      ok: false,
    }
  }

}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};