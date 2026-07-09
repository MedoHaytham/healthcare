/* eslint-disable node/no-unsupported-features/es-syntax */
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Remove empty-string values so they don't produce a bad MongoDB filter
    Object.keys(queryObj).forEach(key => {
      if (queryObj[key] === '' || queryObj[key] === undefined) delete queryObj[key];
    });

    // Advanced Filtering (adds $ prefix to gte|gt|lte|lt)
    // Useful for MediCare e.g. ?price[gte]=50&price[lte]=200
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = `${this.queryString.sort.split(',').join(' ')} _id`;
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt -_id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // Text search across given fields
  // e.g. search(['name', 'category']) for Medicine/LabTest
  search(fields = []) {
    if (!this.queryString.search || fields.length === 0) return this;

    const regex = new RegExp(this.queryString.search, 'i');
    const conditions = fields.map(f => ({ [f]: regex }));

    this.query = this.query.find({ $or: conditions });
    return this;
  }
}

module.exports = APIfeatures;