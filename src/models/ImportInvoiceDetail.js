const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const ImportInvoiceDetailSchema = new mongoose.Schema(
  {
    import_invoice: { type: mongoose.Schema.Types.ObjectId, ref: "ImportInvoice" },
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
    quantity: Number,
    unit_price: Number,
  },
  { timestamps: true }
);

ImportInvoiceDetailSchema.plugin(toJSON);
ImportInvoiceDetailSchema.plugin(paginate);

ImportInvoiceDetailSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const ImportInvoiceDetail = mongoose.model("ImportInvoiceDetail", ImportInvoiceDetailSchema);

module.exports = ImportInvoiceDetail;
