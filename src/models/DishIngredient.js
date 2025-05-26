const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const DishIngredientSchema = new mongoose.Schema(
  {
    dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
    quantity_per_dish: Number,
  },
  { timestamps: true }
);

DishIngredientSchema.plugin(toJSON);
DishIngredientSchema.plugin(paginate);

DishIngredientSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const DishIngredient = mongoose.model("DishIngredient", DishIngredientSchema);

module.exports = DishIngredient;
