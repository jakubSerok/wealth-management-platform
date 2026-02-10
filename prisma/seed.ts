import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Load environment variables from .env file
config();

// Use the same configuration as lib/db.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Default categories for new users
const DEFAULT_CATEGORIES = [
  // Income categories
  { name: "Salary", color: "#10B981", icon: "💰", type: "INCOME" },
  { name: "Freelance", color: "#3B82F6", icon: "💻", type: "INCOME" },
  { name: "Investment Returns", color: "#8B5CF6", icon: "📈", type: "INCOME" },
  { name: "Gifts", color: "#EC4899", icon: "🎁", type: "INCOME" },
  { name: "Other Income", color: "#6B7280", icon: "💵", type: "INCOME" },

  // Expense categories
  { name: "Bills", color: "#EF4444", icon: "📄", type: "EXPENSE" },
  { name: "Food", color: "#F59E0B", icon: "🍔", type: "EXPENSE" },
  { name: "Gym", color: "#06B6D4", icon: "💪", type: "EXPENSE" },
  { name: "Transport", color: "#84CC16", icon: "🚗", type: "EXPENSE" },
  { name: "Shopping", color: "#F97316", icon: "🛍️", type: "EXPENSE" },
  { name: "Entertainment", color: "#A855F7", icon: "🎮", type: "EXPENSE" },
  { name: "Health", color: "#14B8A6", icon: "🏥", type: "EXPENSE" },
  { name: "Education", color: "#0EA5E9", icon: "📚", type: "EXPENSE" },
  { name: "Travel", color: "#F43F5E", icon: "✈️", type: "EXPENSE" },
  { name: "Home", color: "#8B5CF6", icon: "🏠", type: "EXPENSE" },
  { name: "Insurance", color: "#6366F1", icon: "🛡️", type: "EXPENSE" },
  { name: "Subscriptions", color: "#EC4899", icon: "📱", type: "EXPENSE" },
  { name: "Other Expenses", color: "#6B7280", icon: "📝", type: "EXPENSE" },
];

// Subcategories for Bills
const BILLS_SUBCATEGORIES = [
  { name: "Rent", color: "#DC2626", icon: "🏠" },
  { name: "Electricity", color: "#F59E0B", icon: "⚡" },
  { name: "Water", color: "#3B82F6", icon: "💧" },
  { name: "Gas", color: "#10B981", icon: "🔥" },
  { name: "Internet", color: "#8B5CF6", icon: "🌐" },
  { name: "Phone", color: "#06B6D4", icon: "📞" },
  { name: "TV/Cable", color: "#EC4899", icon: "📺" },
];

// Subcategories for Food
const FOOD_SUBCATEGORIES = [
  { name: "Groceries", color: "#059669", icon: "🛒" },
  { name: "Restaurants", color: "#DC2626", icon: "🍽️" },
  { name: "Coffee", color: "#7C3AED", icon: "☕" },
  { name: "Fast Food", color: "#EA580C", icon: "🍟" },
  { name: "Alcohol", color: "#BE123C", icon: "🍷" },
];

// Subcategories for Transport
const TRANSPORT_SUBCATEGORIES = [
  { name: "Public Transport", color: "#0891B2", icon: "🚌" },
  { name: "Fuel", color: "#CA8A04", icon: "⛽" },
  { name: "Car Maintenance", color: "#DC2626", icon: "🔧" },
  { name: "Parking", color: "#7C2D12", icon: "🅿️" },
  { name: "Taxi/Uber", color: "#4C1D95", icon: "🚕" },
];

// Subcategories for Shopping
const SHOPPING_SUBCATEGORIES = [
  { name: "Clothing", color: "#BE123C", icon: "👕" },
  { name: "Electronics", color: "#1E40AF", icon: "📱" },
  { name: "Home & Garden", color: "#14532D", icon: "🏡" },
  { name: "Books", color: "#713F12", icon: "📖" },
  { name: "Sports", color: "#166534", icon: "⚽" },
];

// Subcategories for Entertainment
const ENTERTAINMENT_SUBCATEGORIES = [
  { name: "Movies", color: "#BE123C", icon: "🎬" },
  { name: "Games", color: "#7C3AED", icon: "🎮" },
  { name: "Music", color: "#0891B2", icon: "🎵" },
  { name: "Events", color: "#DC2626", icon: "🎪" },
  { name: "Hobbies", color: "#059669", icon: "🎨" },
];

async function createCategoriesForUser(userId: string) {
  console.log(`Creating categories for user: ${userId}`);

  // Create main categories
  const createdCategories = new Map();

  for (const category of DEFAULT_CATEGORIES) {
    const createdCategory = await prisma.category.create({
      data: {
        userId,
        name: category.name,
        color: category.color,
        icon: category.icon,
      },
    });

    createdCategories.set(category.name, createdCategory);
    console.log(`Created category: ${category.name}`);
  }

  // Create subcategories for Bills
  if (createdCategories.has("Bills")) {
    const billsCategory = createdCategories.get("Bills");
    for (const subcategory of BILLS_SUBCATEGORIES) {
      await prisma.category.create({
        data: {
          userId,
          name: subcategory.name,
          color: subcategory.color,
          icon: subcategory.icon,
          parentId: billsCategory.id,
        },
      });
      console.log(`Created bills subcategory: ${subcategory.name}`);
    }
  }

  // Create subcategories for Food
  if (createdCategories.has("Food")) {
    const foodCategory = createdCategories.get("Food");
    for (const subcategory of FOOD_SUBCATEGORIES) {
      await prisma.category.create({
        data: {
          userId,
          name: subcategory.name,
          color: subcategory.color,
          icon: subcategory.icon,
          parentId: foodCategory.id,
        },
      });
      console.log(`Created food subcategory: ${subcategory.name}`);
    }
  }

  // Create subcategories for Transport
  if (createdCategories.has("Transport")) {
    const transportCategory = createdCategories.get("Transport");
    for (const subcategory of TRANSPORT_SUBCATEGORIES) {
      await prisma.category.create({
        data: {
          userId,
          name: subcategory.name,
          color: subcategory.color,
          icon: subcategory.icon,
          parentId: transportCategory.id,
        },
      });
      console.log(`Created transport subcategory: ${subcategory.name}`);
    }
  }

  // Create subcategories for Shopping
  if (createdCategories.has("Shopping")) {
    const shoppingCategory = createdCategories.get("Shopping");
    for (const subcategory of SHOPPING_SUBCATEGORIES) {
      await prisma.category.create({
        data: {
          userId,
          name: subcategory.name,
          color: subcategory.color,
          icon: subcategory.icon,
          parentId: shoppingCategory.id,
        },
      });
      console.log(`Created shopping subcategory: ${subcategory.name}`);
    }
  }

  // Create subcategories for Entertainment
  if (createdCategories.has("Entertainment")) {
    const entertainmentCategory = createdCategories.get("Entertainment");
    for (const subcategory of ENTERTAINMENT_SUBCATEGORIES) {
      await prisma.category.create({
        data: {
          userId,
          name: subcategory.name,
          color: subcategory.color,
          icon: subcategory.icon,
          parentId: entertainmentCategory.id,
        },
      });
      console.log(`Created entertainment subcategory: ${subcategory.name}`);
    }
  }
}

async function main() {
  console.log("Starting category seed...");

  try {
    // Get all users
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log("No users found. Please create users first.");
      return;
    }

    // Create categories for each user
    for (const user of users) {
      await createCategoriesForUser(user.id);
    }

    console.log("Category seed completed successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
