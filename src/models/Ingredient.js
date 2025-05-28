const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    current_stock: { type: Number, default: 0 },
    unit: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "IngredientCategory" },
  },
  { timestamps: true }
);

ingredientSchema.plugin(toJSON);
ingredientSchema.plugin(paginate);

ingredientSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
