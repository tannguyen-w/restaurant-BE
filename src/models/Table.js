const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");
// Shape data
const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, default: 4 },
    status: { type: String, enum: ["available", "reserved", "in_use"], default: "available" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

tableSchema.plugin(toJSON);
tableSchema.plugin(paginate);

tableSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
