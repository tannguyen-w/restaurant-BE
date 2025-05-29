const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const MemberCardSchema = new mongoose.Schema(
  {
    customer_name: String,
    phone: String,
    email: String,
    total_spent: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    level: String,
    note: String,
    created_at: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  },
  { timestamps: true }
);

MemberCardSchema.plugin(toJSON);
MemberCardSchema.plugin(paginate);

MemberCardSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const MemberCard = mongoose.model("MemberCard", MemberCardSchema);

module.exports = MemberCard;
