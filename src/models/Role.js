const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

RoleSchema.plugin(toJSON);
RoleSchema.plugin(paginate);

RoleSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
