const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    status: { type: String, enum: ["pending", "preparing", "served", "cancelled"], default: "pending" },
    orderTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
