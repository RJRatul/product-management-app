"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Product, apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl, shouldOptimizeImage } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

export default function Shop() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      router.push("/admin-login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await apiService.getProducts(0, 50);
        setProducts(data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, router]);

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  if (!isAuthenticated) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Our Products</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const mainImage =
              product.images && product.images.length > 0
                ? getSafeImageUrl(product.images[0])
                : null;

            const shouldOptimize =
              mainImage && mainImage !== "/placeholder-image.jpg"
                ? shouldOptimizeImage(mainImage)
                : false;

            const hasError = mainImage && imageErrors.has(mainImage);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                {mainImage && !hasError && mainImage !== "/placeholder-image.jpg" ? (
                  <div className="relative w-full h-68">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized={!shouldOptimize}
                      onError={() => handleImageError(mainImage)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-accent1">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  <Link
                    href={`/shop/product/${product.slug}`}
                    className="block w-full bg-accent2 text-primary text-center py-2 rounded font-medium hover:bg-amber-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No products available.</p>
          </div>
        )}
      </main>
    </div>
  );
}
