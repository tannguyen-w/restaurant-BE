const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: Number,
    description: String,
    images: [{ type: String }],
    isCombo: { type: Boolean, default: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "DishCategory" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

dishSchema.statics.isNameTaken = async function (name, excludeDishId) {
  const dish = await this.findOne({ name, _id: { $ne: excludeDishId } });
  return !!dish;
};

dishSchema.plugin(toJSON);
dishSchema.plugin(paginate);

dishSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
