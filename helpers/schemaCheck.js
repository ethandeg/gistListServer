const jsonschema = require("jsonschema")
const { BadRequestError } = require("../expressError")
const schemaCheck = (data, schema) => {
    const result = jsonschema.validate(data, schema)
    if (!result.valid) {
        const listOfErrors = result.errors.map(error => error.stack)
        throw new BadRequestError(listOfErrors)

    }

}


module.exports = schemaCheck