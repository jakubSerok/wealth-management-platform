# Prisma Seed Data

## Prerequisites

Before running the seed, make sure you have:

1. **Database connection configured** - Create a `.env` file in the project root with:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/wealth_management?schema=public"
   ```

2. **Database running** - Make sure your PostgreSQL database is accessible

3. **Users in database** - The seed creates categories for existing users

## Category Seed

This seed file creates default categories for all users in the database.

### Categories Created

#### Income Categories

- Salary 💰
- Freelance 💻
- Investment Returns 📈
- Gifts 🎁
- Other Income 💵

#### Expense Categories

**Main Categories:**

- Bills 📄
- Food 🍔
- Gym 💪
- Transport 🚗
- Shopping 🛍️
- Entertainment 🎮
- Health 🏥
- Education 📚
- Travel ✈️
- Home 🏠
- Insurance 🛡️
- Subscriptions 📱
- Other Expenses 📝

**Subcategories:**

_Bills:_

- Rent 🏠
- Electricity ⚡
- Water 💧
- Gas 🔥
- Internet 🌐
- Phone 📞
- TV/Cable 📺

_Food:_

- Groceries 🛒
- Restaurants 🍽️
- Coffee ☕
- Fast Food 🍟
- Alcohol 🍷

_Transport:_

- Public Transport 🚌
- Fuel ⛽
- Car Maintenance 🔧
- Parking 🅿️
- Taxi/Uber 🚕

_Shopping:_

- Clothing 👕
- Electronics 📱
- Home & Garden 🏡
- Books 📖
- Sports ⚽

_Entertainment:_

- Movies 🎬
- Games 🎮
- Music 🎵
- Events 🎪
- Hobbies 🎨

## Usage

1. **Create .env file** in project root with your database connection:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/wealth_management?schema=public"
   ```

2. **Run the seed script** to create categories for all existing users:
   ```bash
   npm run db:seed
   ```

**Note:** Make sure you have users in the database before running the seed. The script will create categories for all existing users.

## Database Reset

If you want to reset the database and run all seeds:

```bash
npx prisma migrate reset
npm run db:seed
```
