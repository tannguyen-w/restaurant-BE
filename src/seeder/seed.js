require("dotenv").config();
const { faker } = require("@faker-js/faker");

// Import models
const Role = require("../models/Role");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Table = require("../models/Table");
const DishCategory = require("../models/DishCategory");
const Dish = require("../models/Dish");
const IngredientCategory = require("../models/IngredientCategory");
const Ingredient = require("../models/Ingredient");
const Combo = require("../models/Combo");
const DishIngredient = require("../models/DishIngredient");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const Invoice = require("../models/Invoice");
const Reservation = require("../models/Reservation");
const ImportInvoice = require("../models/ImportInvoice");
const ImportInvoiceDetail = require("../models/ImportInvoiceDetail");
const Supplier = require("../models/Supplier");
const MemberCard = require("../models/MemberCard");

const seed = async () => {
  try {
    console.log("🔁 Starting seed...");

    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      var [adminRole, managerRole] = await Role.insertMany([
        { name: "admin", permissions: ["all"] },
        { name: "manager", permissions: ["manage_orders", "manage_staff"] },
      ]);
      console.log("✅ Seeded roles");
    } else {
      adminRole = await Role.findOne({ name: "admin" });
      managerRole = await Role.findOne({ name: "manager" });
    }

    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = await Restaurant.create({
        name: "Nhà hàng Demo",
        address: "123 Lê Lợi",
        hotline: "0909123456",
        email: "contact@demo.vn",
        opening_hours: "09:00 - 22:00",
      });
      console.log("✅ Seeded restaurant");
    }

    const userCount = await User.countDocuments();
    let admin;
    if (userCount === 0) {
      admin = await User.create({
        username: "admin",
        password: "admin123",
        full_name: "Admin",
        role: adminRole._id,
        restaurant: restaurant._id,
      });
      console.log("✅ Seeded admin user");
    } else {
      admin = await User.findOne({ username: "admin" });
    }

    const tableCount = await Table.countDocuments();
    let tables;
    if (tableCount === 0) {
      tables = await Table.insertMany([
        { name: "T1", capacity: 4, restaurant: restaurant._id },
        { name: "T2", capacity: 6, restaurant: restaurant._id },
      ]);
      console.log("✅ Seeded tables");
    } else {
      tables = await Table.find();
    }

    const dishCatCount = await DishCategory.countDocuments();
    let mainDishCat, drinkCat;
    if (dishCatCount === 0) {
      [mainDishCat, drinkCat] = await DishCategory.insertMany([{ name: "Món chính" }, { name: "Thức uống" }]);
      console.log("✅ Seeded dish categories");
    } else {
      mainDishCat = await DishCategory.findOne({ name: "Món chính" });
      drinkCat = await DishCategory.findOne({ name: "Thức uống" });
    }

    const ingredientCatCount = await IngredientCategory.countDocuments();
    let meatCat, spiceCat;
    if (ingredientCatCount === 0) {
      [meatCat, spiceCat] = await IngredientCategory.insertMany([{ name: "Thịt" }, { name: "Gia vị" }]);
      console.log("✅ Seeded ingredient categories");
    } else {
      meatCat = await IngredientCategory.findOne({ name: "Thịt" });
      spiceCat = await IngredientCategory.findOne({ name: "Gia vị" });
    }

    const ingredientCount = await Ingredient.countDocuments();
    let chicken, lemongrass;
    if (ingredientCount === 0) {
      [chicken, lemongrass] = await Ingredient.insertMany([
        { name: "Gà", unit: "kg", category: meatCat._id, current_stock: 50 },
        { name: "Sả", unit: "g", category: spiceCat._id, current_stock: 1000 },
      ]);
      console.log("✅ Seeded ingredients");
    } else {
      chicken = await Ingredient.findOne({ name: "Gà" });
      lemongrass = await Ingredient.findOne({ name: "Sả" });
    }

    const dishCount = await Dish.countDocuments();
    let gaNuong, pepsi;
    if (dishCount === 0) {
      [gaNuong, pepsi] = await Dish.insertMany([
        {
          name: "Gà nướng",
          price: 120000,
          description: "Gà nướng sả",
          category: mainDishCat._id,
          is_combo: false,
          restaurant: restaurant._id,
        },
        {
          name: "Pepsi",
          price: 15000,
          description: "Nước ngọt có ga",
          category: drinkCat._id,
          is_combo: false,
          restaurant: restaurant._id,
        },
      ]);
      console.log("✅ Seeded dishes");
    } else {
      gaNuong = await Dish.findOne({ name: "Gà nướng" });
      pepsi = await Dish.findOne({ name: "Pepsi" });
    }

    if ((await DishIngredient.countDocuments()) === 0) {
      await DishIngredient.create({
        dish: gaNuong._id,
        ingredient: chicken._id,
        quantity_per_dish: 1,
      });
      console.log("✅ Seeded dish ingredients");
    }

    if ((await Dish.countDocuments({ is_combo: true })) === 0) {
      const comboDish = await Dish.create({
        name: "Combo Gà nướng + Pepsi",
        price: 130000,
        is_combo: true,
        restaurant: restaurant._id,
        category: mainDishCat._id,
      });

      await Combo.insertMany([
        { combo: comboDish._id, dish: gaNuong._id, quantity: 1 },
        { combo: comboDish._id, dish: pepsi._id, quantity: 1 },
      ]);
      console.log("✅ Seeded combo with multiple dishes");
    }

    if ((await Supplier.countDocuments()) === 0) {
      var supplier = await Supplier.create({
        name: "Công ty Thực phẩm ABC",
        phone: "0911223344",
        address: "456 Tôn Đức Thắng",
      });
      console.log("✅ Seeded supplier");
    } else {
      supplier = await Supplier.findOne();
    }

    if ((await ImportInvoice.countDocuments()) === 0) {
      const importInvoice = await ImportInvoice.create({
        supplier: supplier._id,
        total_amount: 1000000,
        staff: admin._id,
      });

      await ImportInvoiceDetail.insertMany([
        {
          import_invoice: importInvoice._id,
          ingredient: chicken._id,
          quantity: 10,
          unit_price: 90000,
        },
        {
          import_invoice: importInvoice._id,
          ingredient: lemongrass._id,
          quantity: 2,
          unit_price: 15000,
        },
      ]);
      console.log("✅ Seeded import invoice + details");
    }

    if ((await Reservation.countDocuments()) === 0) {
      await Reservation.create({
        customer_name: "Nguyễn Văn A",
        phone: "0909333222",
        table: tables[0]._id,
        reservation_time: new Date(),
        note: "Tiệc sinh nhật",
      });
      console.log("✅ Seeded reservation");
    }

    if ((await MemberCard.countDocuments()) === 0) {
      await MemberCard.create({
        customer_name: "Nguyễn Văn A",
        phone: "0909333222",
        points: 100,
        total_spent: 500000,
        user: admin._id,
      });
      console.log("✅ Seeded member card");
    }

    if ((await Order.countDocuments()) === 0) {
      const order = await Order.create({
        table: tables[0]._id,
        user: admin._id,
        status: "served",
      });

      await OrderDetail.create({
        order: order._id,
        dish: gaNuong._id,
        quantity: 2,
        price: 120000,
      });

      await Invoice.create({
        order: order._id,
        total_amount: 240000,
        discount: 0,
        final_amount: 240000,
        payment_method: "cash",
      });
      console.log("✅ Seeded order + invoice");
    }

    console.log("🎉 Hoàn tất seed dữ liệu!");
  } catch (err) {
    console.error("❌ Lỗi khi seed dữ liệu:", err);
  }
};

module.exports = seed;
