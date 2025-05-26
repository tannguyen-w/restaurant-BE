const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const DishCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

DishCategorySchema.plugin(toJSON);
DishCategorySchema.plugin(paginate);

DishCategorySchema.plugin(mongoose_delete, { overrideMethods: "all" });
const DishCategory = mongoose.model("DishCategory", DishCategorySchema);

module.exports = DishCategory;
