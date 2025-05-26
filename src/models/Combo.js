const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const ComboSchema = new mongoose.Schema(
  {
    combo: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" }, // món combo
    dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" }, // món con
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

ComboSchema.plugin(toJSON);
ComboSchema.plugin(paginate);

ComboSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Combo = mongoose.model("Combo", ComboSchema);

module.exports = Combo;
