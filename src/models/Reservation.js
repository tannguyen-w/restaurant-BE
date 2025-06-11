const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { toJSON, paginate } = require("./plugins");

const reservationSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    phone: String,
    reservation_time: Date,
    timeSlot: String,
    number_of_people: Number,
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  },
  { timestamps: true }
);

reservationSchema.plugin(toJSON);
reservationSchema.plugin(paginate);

reservationSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
