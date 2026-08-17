import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaRocket, FaCreditCard, FaHeart, FaStar, FaShieldAlt, FaUserTie, FaUserCheck, FaUserCog } from 'react-icons/fa';

const features = [
  {
    icon: <FaBookOpen />,
    color: 'text-blue-400',
    title: 'Curated Collection',
    desc: 'Thousands of titles across every genre — fiction, non-fiction, self-help, science, and more.',
  },
  {
    icon: <FaRocket />,
    color: 'text-bronze-400',
    title: 'Fast Delivery',
    desc: 'Get your orders delivered swiftly to your doorstep across India, with real-time tracking.',
  },
  {
    icon: <FaCreditCard />,
    color: 'text-blue-400',
    title: 'Secure Payments',
    desc: 'Pay safely via Cash on Delivery or online through our Razorpay-powered checkout.',
  },
  {
    icon: <FaHeart />,
    color: 'text-rose-400',
    title: 'Save Favourites',
    desc: "Build your personal reading wishlist and revisit it whenever you're ready to buy.",
  },
  {
    icon: <FaStar />,
    color: 'text-bronze-400',
    title: 'Best Prices',
    desc: 'We offer competitive prices with no hidden charges — more books, less spending.',
  },
  {
    icon: <FaShieldAlt />,
    color: 'text-blue-400',
    title: 'Private & Secure',
    desc: 'Your data is encrypted and never sold. We respect your privacy completely.',
  },
];

const team = [
  {
    name: 'Arjun Sharma',
    role: 'Founder & CEO',
    icon: <FaUserTie />,
    bio: 'Lifelong bibliophile who turned a passion for books into a mission to make reading accessible.',
  },
  {
    name: 'Priya Mehta',
    role: 'Head of Curation',
    icon: <FaUserCheck />,
    bio: 'Former librarian with 10+ years of experience selecting the best titles for every kind of reader.',
  },
  {
    name: 'Rahul Verma',
    role: 'Lead Developer',
    icon: <FaUserCog />,
    bio: 'Full-stack engineer who built BookHeaven from the ground up with performance and UX in mind.',
  },
];

const AboutUs = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-zinc-800 to-zinc-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          About <span className="gradient-text">BookHeaven</span>
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          We believe every great story deserves to be read. BookHeaven is your one-stop destination
          for discovering, saving, and purchasing books you'll love.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">Our Mission</h2>
            <p className="text-zinc-400 leading-8">
              BookHeaven was founded with a simple mission — to make the joy of reading accessible to
              everyone. We handpick titles across every genre, price books fairly, and deliver them
              reliably so you can spend less time searching and more time reading.
            </p>
            <p className="text-zinc-400 leading-8 mt-4">
              From timeless classics to the latest bestsellers, from affordable pocket reads to premium
              collector editions, we have something for every reader and every budget.
            </p>
          </div>
          <div className="flex items-center justify-center bg-zinc-800 rounded-2xl h-56 shadow-inner border border-zinc-700">
            <FaBookOpen className="text-7xl text-bronze-600/40" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-800/50 py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-12">Why Choose BookHeaven?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-zinc-500 transition-all shadow-md"
              >
                <div className={`text-3xl mb-4 ${f.color}`}>{f.icon}</div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10,000+', label: 'Books Available' },
            { value: '50,000+', label: 'Happy Readers' },
            { value: '500+', label: 'Authors Featured' },
            { value: '4.9', label: 'Average Rating' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-md"
            >
              <p className="text-3xl font-bold text-bronze-400 mb-1">{stat.value}</p>
              <p className="text-zinc-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-zinc-800/50 py-16 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center shadow-md hover:border-zinc-500 transition-all animate-fade-in-up"
              >
                <div className="h-20 w-20 rounded-full bg-zinc-750 border-4 border-zinc-600 flex items-center justify-center mx-auto mb-4 text-3xl text-bronze-400">
                  {member.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-zinc-400 text-sm leading-6">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-zinc-900">
        <h2 className="text-3xl font-bold mb-4">
          Ready to <span className="gradient-text">Start Reading?</span>
        </h2>
        <p className="text-zinc-400 mb-8 text-lg">
          Explore our full collection and find your next favourite book today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/all-books"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 duration-300"
          >
            Browse Books
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 border border-zinc-500 hover:border-bronze-500 text-zinc-300 hover:text-bronze-200 font-semibold rounded-xl transition-all duration-300"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
