const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    hotline: String,
    email: String,
    opening_hours: String,
    logoUrl: String,
  },
  { timestamps: true }
);

RestaurantSchema.plugin(toJSON);
RestaurantSchema.plugin(paginate);

RestaurantSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
