class APIFilters {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        //this.filters = {};
    }

    search() {
        if (this.queryString.search) {
            const keyword = this.queryString.search;

            this.query = this.query.find({
                $or: [
                    { status: { $regex: keyword, $options: "i" } },
                    { fromPlace: { $regex: keyword, $options: "i" } },
                    { toPlace: { $regex: keyword, $options: "i" } },
                    { travelDate: { $regex: keyword, $options: "i" } },
                    // These require populated `user`
                    { "user.name": { $regex: keyword, $options: "i" } },
                    { "user.email": { $regex: keyword, $options: "i" } },
                    { "user.mobile": { $regex: keyword, $options: "i" } },
                ],
            });
        }

        return this;
    }



    filters() {
        const filterQuery = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((field) => delete filterQuery[field]);

        const mongoFilter = {};

        // Loop through each query param
        for (const key in filterQuery) {
            // Match pattern like totalAmount[$gte]
            const match = key.match(/^([a-zA-Z0-9_]+)\[(\w+)\]$/);
            if (match) {
                const field = match[1];       // e.g. "totalAmount"
                const operator = match[2];    // e.g. "gte"
                const mongoOperator = `$${operator}`;  // "$gte"

                if (!mongoFilter[field]) mongoFilter[field] = {};
                mongoFilter[field][mongoOperator] = isNaN(filterQuery[key])
                    ? filterQuery[key]
                    : Number(filterQuery[key]);
            } else {
                // Simple equality filter, like status=active
                mongoFilter[key] = isNaN(filterQuery[key])
                    ? filterQuery[key]
                    : Number(filterQuery[key]);
            }
        }

        this.query = this.query.find(mongoFilter);
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skip = (currentPage - 1) * resPerPage;

        this.query = this.query.skip(skip).limit(resPerPage);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortFields = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortFields);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }



}

export default APIFilters;