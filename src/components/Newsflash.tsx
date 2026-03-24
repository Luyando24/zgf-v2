import Link from "next/link";
import { Calendar, Facebook } from "lucide-react";
import { getRecentFacebookPosts } from "@/lib/facebook";

export default async function Newsflash() {
  const posts = await getRecentFacebookPosts(3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-dark">Social Media Highlights</h2>
          <Link href="/facebook-posts" className="text-primary font-bold hover:underline flex items-center">
            <Facebook size={18} className="mr-2" />
            All Highlights
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={post.permalink_url}
                target="_blank"
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {post.full_picture && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.full_picture} 
                      alt="Facebook Post" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center mr-3">
                        <Facebook size={16} className="text-white" />
                      </div>
                      <span className="font-bold text-sm text-dark">ZGF</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.created_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-4 leading-relaxed">
                    {post.message || "No message content"}
                  </p>
                  
                  <div className="mt-auto text-primary text-xs font-bold flex items-center group-hover:underline">
                    View on Facebook
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <Facebook size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No recent social media updates available.</p>
            <Link 
              href="https://facebook.com/ZambianGovernanceFoundation" 
              target="_blank"
              className="mt-4 inline-block text-primary font-bold hover:underline"
            >
              Visit Our Facebook Page
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
