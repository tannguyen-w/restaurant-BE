const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const ImportInvoiceSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    import_date: { type: Date, default: Date.now },
    total_amount: Number,
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ImportInvoiceSchema.plugin(toJSON);
ImportInvoiceSchema.plugin(paginate);

ImportInvoiceSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const ImportInvoice = mongoose.model("ImportInvoice", ImportInvoiceSchema);

module.exports = ImportInvoice;
