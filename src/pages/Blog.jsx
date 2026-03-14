import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

const Blog = () => {
  const articles = [
    {
      title: "10 Tips to Ace Your Job Interview",
      category: "Career Tips",
      date: "March 10, 2024",
      excerpt: "Learn proven strategies to prepare for and excel in any job interview.",
      image: "📝"
    },
    {
      title: "The Future of Remote Work",
      category: "Industry Trends",
      date: "March 8, 2024",
      excerpt: "Explore how remote work is shaping the job market and company culture.",
      image: "🌍"
    },
    {
      title: "How to Write an Impressive Resume",
      category: "Career Tips",
      date: "March 5, 2024",
      excerpt: "A comprehensive guide to creating a resume that gets noticed by recruiters.",
      image: "📄"
    },
    {
      title: "AI in Recruitment: What You Need to Know",
      category: "Technology",
      date: "March 1, 2024",
      excerpt: "Understanding how artificial intelligence is revolutionizing the hiring process.",
      image: "🤖"
    },
    {
      title: "Salary Negotiation 101",
      category: "Career Tips",
      date: "February 28, 2024",
      excerpt: "Master the art of negotiating your salary and benefits.",
      image: "💰"
    },
    {
      title: "LinkedIn Profile Optimization Tips",
      category: "Career Tips",
      date: "February 25, 2024",
      excerpt: "Make your professional profile stand out to recruiters and employers.",
      image: "💼"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-secondary-900 mb-4">JobConnect Blog</h1>
        <p className="text-xl text-secondary-700 mb-12 max-w-3xl">
          Industry insights, career tips, and job market trends to help you succeed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-secondary-100">
              <div className="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center text-6xl">
                {article.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-secondary-500 flex items-center gap-1">
                    <Calendar size={14} /> {article.date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{article.title}</h3>
                <p className="text-secondary-700 mb-4">{article.excerpt}</p>
                <Link to="#" className="text-secondary-600 font-semibold hover:text-secondary-800 flex items-center gap-2">
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-secondary-900 text-white rounded-lg p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-secondary-100 mb-6">Get the latest career tips and job market insights delivered to your inbox.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none"
            />
            <button className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-secondary-600 hover:text-secondary-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
