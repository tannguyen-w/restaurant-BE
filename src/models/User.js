const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const bcrypt = require("bcrypt");
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

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true, // đảm bảo mỗi user có 1 role
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("insertMany", async function (next, docs) {
  for (const doc of docs) {
    if (doc.password && !doc.password.startsWith("$2")) {
      // tránh hash 2 lần
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("User", userSchema);

module.exports = User;
