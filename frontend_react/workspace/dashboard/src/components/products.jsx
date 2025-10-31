import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, AlertTriangle, Clock } from "lucide-react";

export default function ProductReviewInsights() {
  const [customerStories, setCustomerStories] = useState([]);
  const [productsNeedingAttention, setProductsNeedingAttention] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data from Flask or Next.js API
  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('https://awakenu-sentiment-analysis.onrender.com/api/alerts'); // backend endpoint
        const data = await res.json();
        setCustomerStories(data.customerStories || []);
        setProductsNeedingAttention(data.productsNeedingAttention || []);
      } catch (error) {
        console.error("Error fetching product insights:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const getSentimentColor = (sentiment, type) => {
    if (type === "positive" || sentiment >= 80) return "text-green-400";
    if (type === "mixed" || (sentiment >= 50 && sentiment < 80)) return "text-yellow-400";
    return "text-red-400";
  };

  const getSentimentIcon = (sentiment, type) => {
    if (type === "positive" || sentiment >= 80) return "😊";
    if (type === "mixed" || (sentiment >= 50 && sentiment < 80)) return "😐";
    return "😞";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#2A005E] to-[#5A1EA1]">
        <p className="text-xl font-semibold animate-pulse">Loading product insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A005E] to-[#5A1EA1] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Product Review & Insights
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real-time analysis of product feedback and customer sentiment.
          </p>
        </div>

        {/* Customer Story Snapshots */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Customer Story Snapshots</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
            {customerStories.length === 0 ? (
              <p className="text-gray-300">No customer stories available yet.</p>
            ) : (
              customerStories.map((story) => (
                <Card
                  key={story.id}
                  className="min-w-[320px] bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                        {story.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{story.name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < story.rating ? "text-yellow-400 fill-current" : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getSentimentIcon(story.sentiment, story.sentimentType)}</span>
                          <span
                            className={`font-semibold ${getSentimentColor(story.sentiment, story.sentimentType)}`}
                          >
                            {story.sentiment}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-200 text-sm leading-relaxed">"{story.review}"</p>

                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs text-gray-400">Product: {story.product}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Highlight of the Month */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-3 py-1">
              ⭐ Top Performer
            </Badge>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">Wireless Headphones Pro</h3>
                  <p className="text-gray-300 text-lg">
                    Outstanding customer satisfaction with 94% positive sentiment and consistently high ratings.
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-xl font-semibold text-white">4.8/5</span>
                      <span className="text-gray-400">(1,247 reviews)</span>
                    </div>

                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">+18% this month</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    94%
                  </div>
                  <p className="text-green-400 font-semibold">Positive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Needing Attention */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Products Needing Attention</h2>

          <div className="space-y-4">
            {productsNeedingAttention.length === 0 ? (
              <p className="text-gray-300">No issues detected in products right now.</p>
            ) : (
              productsNeedingAttention.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {product.priority === "HIGH" ? (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-400" />
                          )}
                          <Badge
                            className={`${
                              product.priority === "HIGH"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            } font-semibold`}
                          >
                            {product.priority}
                          </Badge>
                        </div>

                        <div>
                          <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                          <p className="text-gray-400 text-sm">{product.issue}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className={`text-2xl font-bold ${getSentimentColor(product.sentiment)}`}>
                            {product.sentiment}%
                          </div>
                          <p className="text-xs text-gray-400">Sentiment</p>
                        </div>

                        <div>
                          <div className="text-2xl font-bold text-white">{product.reviews}</div>
                          <p className="text-xs text-gray-400">Reviews</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
