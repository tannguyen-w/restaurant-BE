const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");
// Shape data
const userSchema = new mongoose.Schema(
  {
    full_name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    phone: String,
    avatar: String,
    memberCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemberCard",
    },
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("User", userSchema);

module.exports = User;
