const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const InvoiceSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    total_amount: Number,
    discount: { type: Number, default: 0 },
    final_amount: Number,
    payment_time: { type: Date, default: Date.now },
    payment_method: { type: String, enum: ["cash", "card", "e-wallet"] },
  },
  { timestamps: true }
);

InvoiceSchema.plugin(toJSON);
InvoiceSchema.plugin(paginate);

InvoiceSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = Invoice;
