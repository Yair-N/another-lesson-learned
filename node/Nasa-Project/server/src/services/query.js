const DEFAULT = {
    PAGE_LIMIT: 0,
    PAGE_NUMBER: 1,
}

function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT.PAGE_LIMIT
    const page = Math.abs(query.page) || DEFAULT.PAGE_NUMBER
    const skip = (page - 1) * limit

    return {
        skip,
        limit,
    }
}


module.exports = {
    getPagination,
}