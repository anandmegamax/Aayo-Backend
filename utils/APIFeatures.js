class APIFeatures {
    constructor(query, queryString, searchableFields = [], sortableFields = []) {
        this.query = query;
        this.queryString = queryString;
        this.searchableFields = searchableFields;
        this.sortableFields = sortableFields;
    }

    search() {
        const keyword = this.queryString.search;
        if (keyword && this.searchableFields.length > 0) {
            const orQuery = this.searchableFields.map((field) => ({
                [field]: { $regex: keyword, $options: "i" },
            }));
            this.query = this.query.find({ $or: orQuery });
        }
        return this;
    }

    sort() {
        const sortParam = this.queryString.sort;
        if (sortParam && this.sortableFields.length > 0) {
            const sortFields = sortParam
                .split(",")
                .filter((field) => {
                    const baseField = field.replace(/^-/, "");
                    return this.sortableFields.includes(baseField);
                })
                .join(" ");
            if (sortFields) {
                this.query = this.query.sort(sortFields);
            }
        }
        return this;
    }

    paginate(resultsPerPage = 10) {
        const page = parseInt(this.queryString.page) || 1;
        const skip = resultsPerPage * (page - 1);
        this.query = this.query.skip(skip).limit(resultsPerPage);
        return this;
    }
}

export default APIFeatures;
