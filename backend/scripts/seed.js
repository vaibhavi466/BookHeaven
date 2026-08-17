const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../conn/conn');
const User = require('../models/user');
const Book = require('../models/book');

dotenv.config();

const books = [
  {
    url: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 499,
    desc: 'A practical guide to building good habits, breaking bad ones, and mastering tiny behaviors that lead to remarkable results.',
    language: 'English',
  },
  {
    url: 'https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 299,
    desc: 'A philosophical novel about dreams, destiny, and the journey of a shepherd boy searching for his personal legend.',
    language: 'English',
  },
  {
    url: 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    price: 399,
    desc: 'A personal finance classic explaining money mindset, assets, liabilities, and financial independence.',
    language: 'English',
  },
  {
    url: 'https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 449,
    desc: 'A book about how people think about money, wealth, greed, saving, risk, and long-term financial behavior.',
    language: 'English',
  },
  {
    url: 'https://m.media-amazon.com/images/I/71UwSHSZRnS._AC_UF1000,1000_QL80_.jpg',
    title: 'Ikigai',
    author: 'Héctor García and Francesc Miralles',
    price: 350,
    desc: 'A Japanese-inspired guide to finding purpose, happiness, longevity, and balance in everyday life.',
    language: 'English',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Starting database seed...');

    // Seed admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@bookheaven.com',
        password: hashedPassword,
        address: 'BookHeaven Admin Office, India',
        role: 'admin',
      });
      console.log('✅ Admin user created  (username: admin | password: Admin@123)');
    } else {
      console.log('ℹ️  Admin user already exists — skipped');
    }

    // Seed books
    for (const book of books) {
      const exists = await Book.findOne({ title: book.title });
      if (!exists) {
        await Book.create(book);
        console.log(`✅ Book added: "${book.title}"`);
      } else {
        console.log(`ℹ️  Book already exists: "${book.title}" — skipped`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
