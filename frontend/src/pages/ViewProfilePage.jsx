import React from "react";
import { useParams } from "react-router-dom";

function ViewProfilePage() {
  const { sellerId } = useParams();

  // Fake seller data
  const sellers = [
    {
      id: "1",
      name: "John Doe",
      email: "johndoe@university.edu",
      department: "Computer Science",
      bio: "Enthusiastic student, loves books and trading.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "janesmith@university.edu",
      department: "Engineering",
      bio: "Looking to help students buy and sell items easily.",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  // Fake posts data
  const posts = [
    {
      id: "p1",
      sellerId: "1",
      title: "Data Structures Book",
      category: "Book",
      description: "Excellent condition, almost new",
    },
    {
      id: "p2",
      sellerId: "1",
      title: "Laptop for Sale",
      category: "Electronics",
      description: "Used, good condition, 8GB RAM",
    },
    {
      id: "p3",
      sellerId: "2",
      title: "Physics Book",
      category: "Book",
      description: "Second-hand, well maintained",
    },
  ];

  const seller = sellers.find((s) => s.id === sellerId) || sellers[0];
  const sellerPosts = posts.filter((post) => post.sellerId === seller.id);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* Seller Profile */}
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md flex flex-col items-center mb-6">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold">{seller.name}</h2>
        <p className="text-gray-600">{seller.department}</p>
        <p className="text-gray-500 mb-4">{seller.email}</p>
        <p className="text-gray-700 text-center">{seller.bio}</p>
      </div>

      {/* Seller Latest Posts */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4">Latest Posts</h3>
        {sellerPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellerPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-lg">{post.title}</h4>
                <p className="text-gray-500 text-sm">{post.category}</p>
                <p className="text-gray-700 mt-1">{post.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No posts found for this seller.</p>
        )}
      </div>
    </div>
  );
}

export default ViewProfilePage;
