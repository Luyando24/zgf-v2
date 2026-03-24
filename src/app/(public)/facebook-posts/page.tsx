import { getRecentFacebookPosts } from "@/lib/facebook";
import Link from "next/link";
import { Calendar, Facebook, ExternalLink } from "lucide-react";

export default async function FacebookPostsPage() {
  const posts = await getRecentFacebookPosts(20);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Home</Link>
          <h1 className="text-4xl font-bold text-dark">Social Media Highlights</h1>
          <p className="text-gray-600 mt-2">Latest updates from our Facebook community</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {post.full_picture && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.full_picture} 
                      alt="Facebook Post" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <Facebook size={20} className="text-white" />
                      </div>
                      <span className="font-bold text-dark">ZGF</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.created_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed whitespace-pre-wrap">
                    {post.message || "No message content"}
                  </p>
                  
                  <Link 
                    href={post.permalink_url} 
                    target="_blank"
                    className="mt-auto inline-flex items-center justify-center bg-[#1877F2] text-white font-bold py-3 px-6 rounded-full hover:bg-[#166fe5] transition-colors w-full"
                  >
                    <ExternalLink size={18} className="mr-2" />
                    View on Facebook
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <Facebook size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-dark mb-4">No recent updates found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't load the latest posts at the moment. You can visit our Facebook page directly to see all our updates.
            </p>
            <Link 
              href="https://facebook.com/ZambianGovernanceFoundation" 
              target="_blank"
              className="inline-flex items-center justify-center bg-[#1877F2] text-white font-bold py-4 px-10 rounded-full hover:bg-[#166fe5] transition-colors"
            >
              <Facebook size={20} className="mr-2" />
              Visit Our Facebook Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
