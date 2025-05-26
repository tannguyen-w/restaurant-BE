const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const IngredientCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

IngredientCategorySchema.plugin(toJSON);
IngredientCategorySchema.plugin(paginate);

IngredientCategorySchema.plugin(mongoose_delete, { overrideMethods: "all" });
const IngredientCategory = mongoose.model("IngredientCategory", IngredientCategorySchema);

module.exports = IngredientCategory;
