const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const OrderDetailSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
    quantity: { type: Number, default: 1 },
    price: Number,
  },
  { timestamps: true }
);

OrderDetailSchema.plugin(toJSON);
OrderDetailSchema.plugin(paginate);

OrderDetailSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);

module.exports = OrderDetail;
