const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: String,
    address: String,
    phone: String,
  },
  { timestamps: true }
);

supplierSchema.plugin(toJSON);
supplierSchema.plugin(paginate);

supplierSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
