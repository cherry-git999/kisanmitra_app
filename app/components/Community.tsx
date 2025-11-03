import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Camera,
  Send,
  X,
} from "lucide-react";
import { useI18n } from "../i18n";

const mockPosts = [
  {
    id: 1,
    authorKey: "raviKumar",
    timeKey: "twoHoursAgo",
    contentKey: "successfullyControlledAphids",
    imageUrl: "/p1.jpg",
    likes: 24,
    comments: 8,
    liked: false,
  },
  {
    id: 2,
    authorKey: "lakshmiDevi",
    timeKey: "fiveHoursAgo",
    contentKey: "treatedRagiSeedsBeejamrutha",
    imageUrl: "/p2.jpg",
    likes: 42,
    comments: 15,
    liked: true,
  },
  {
    id: 3,
    authorKey: "sureshBabu",
    timeKey: "oneDayAgo",
    contentKey: "companionPlantingWorks",
    imageUrl: "/p3.jpg",
    likes: 31,
    comments: 12,
    liked: false,
  },
];

export default function Community() {
  const { t } = useI18n();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState(mockPosts);

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const handleSubmitPost = () => {
    if (newPostText.trim()) {
      const newPost = {
        id: posts.length + 1,
        authorKey: "you",
        timeKey: "justNow",
        contentKey: newPostText,
        imageUrl: "",
        likes: 0,
        comments: 0,
        liked: false,
      };
      setPosts([newPost, ...posts]);
      setNewPostText("");
      setShowNewPost(false);
    }
  };

  if (showNewPost) {
    return (
      <div className="min-h-screen bg-primary-50">
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowNewPost(false)}
              className="text-primary-100 hover:text-white"
            >
              {t("cancel")}
            </button>
            <h1 className="text-xl font-bold">{t("newPost")}</h1>
            <button onClick={handleSubmitPost} className="text-white font-bold">
              {t("post")}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={t("communityComposePlaceholder")}
            className="w-full h-40 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />

          <button className="btn-secondary w-full">
            <Camera size={24} />
            {t("addPhoto")}
          </button>

          <div className="card bg-yellow-50 border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-3">
              {t("postingTips")}
            </h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>{t("tip1")}</li>
              <li>{t("tip2")}</li>
              <li>{t("tip3")}</li>
              <li>{t("tip4")}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {t("communityHeader")}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base">
          {t("communitySub")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* New Post Button */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-bold text-primary-500">
            {t("recentPosts")}
          </h2>
          <button onClick={() => setShowNewPost(true)} className="btn-primary">
            <Plus size={20} />
            {t("newPost")}
          </button>
        </div>

        {/* Posts */}
        <div className="px-4 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary-500">
                    {t(post.authorKey)[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-primary-500">
                    {t(post.authorKey)}
                  </h3>
                  <p className="text-sm text-gray-500">{t(post.timeKey)}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4">{t(post.contentKey)}</p>

              {/* Post Image */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 ${
                    post.liked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={post.liked ? "currentColor" : "none"}
                  />
                  <span className="font-semibold">{post.likes}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-primary-500">
                  <MessageCircle size={20} />
                  <span className="font-semibold">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-primary-500">
                  <Share2 size={20} />
                  <span className="font-semibold">{t("share")}</span>
                </button>
              </div>

              {/* Comment Input */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <input
                  type="text"
                  placeholder={t("writeComment")}
                  className="flex-1 px-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200">
                  <Send size={16} className="text-primary-500" />
                </button>
              </div>
            </div>
          ))}

          {/* End Message */}
          <div className="text-center py-8">
            <p className="text-gray-500">{t("caughtUp")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
