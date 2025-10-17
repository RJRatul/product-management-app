"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product, apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await apiService.getProduct(id);
        setProduct(productData);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Product not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/shop"
            className="flex items-center text-accent2 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent1">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    Category:
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled={product.stock === 0}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    product.stock > 0
                      ? "bg-accent2 text-primary hover:bg-amber-600 hover:text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
