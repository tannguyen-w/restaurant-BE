const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    status: { type: String, enum: ["pending", "preparing", "served", "cancelled", "finished"], default: "pending" },
    orderTime: { type: Date, default: Date.now },
    fullName: String,
    phone: String,
    address: String,
    note: String,
  },
  { timestamps: true }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
