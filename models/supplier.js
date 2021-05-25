const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: String,
    addressLine1: String,
    addressLine2: String,
    addressCity: String,
    addressPostcode: String,
    contactName: String,
    contactEmail: String,
    contactNum: String
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
