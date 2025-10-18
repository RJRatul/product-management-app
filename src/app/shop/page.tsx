"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Product, Category, apiService } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl, shouldOptimizeImage } from "@/lib/utils";
import { Image as ImageIcon, Search, Filter, X } from "lucide-react";
import Pagination from "@/components/Pagination";

export default function Shop() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit] = useState(12); // 12 products per page for better grid layout
  const [hasMore, setHasMore] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch categories for filter dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiService.getCategories(0, 100);
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let data: Product[];

      if (search) {
        // Use search endpoint when there's search text
        data = await apiService.searchProducts(search, offset, limit);
      } else if (selectedCategory) {
        // Use category filter when category is selected
        data = await apiService.getProducts(offset, limit, "", selectedCategory);
      } else {
        // Normal paginated products
        data = await apiService.getProducts(offset, limit);
      }

      setProducts(data);
      setHasMore(data.length === limit);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [offset, limit, search, selectedCategory]);

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      router.push("/admin-login");
      return;
    }

    fetchCategories();
  }, [isAuthenticated, router, fetchCategories]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [fetchProducts, isAuthenticated]);

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setOffset(0);
    setSearch(""); // Clear search when category is selected
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setOffset(0);
  };

  const handleNext = () => {
    setOffset((prev) => prev + limit);
  };

  const handlePrevious = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  const hasActiveFilters = search || selectedCategory;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
      </div>
    );
  }

  if (loading && products.length === 0) {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-primary">Our Products</h1>
          <div className="text-sm text-gray-600">
            {products.length > 0 && (
              <span>
                Showing {offset + 1} to {offset + products.length} products
              </span>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer bg-accent2 text-primary px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-transparent w-full sm:w-auto"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="cursor-pointer flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Active Filters Info */}
          {hasActiveFilters && (
            <div className="text-sm text-gray-600">
              {search && <span>Search: {search}</span>}
              {search && selectedCategory && <span> • </span>}
              {selectedCategory && (
                <span>
                  Category:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group hover:scale-105 transition-transform"
              >
                {mainImage && !hasError && mainImage !== "/placeholder-image.jpg" ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
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
                    className="block w-full bg-accent2 text-primary text-center py-2 rounded font-medium hover:bg-amber-600 hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-8">
            <Pagination
              offset={offset}
              limit={limit}
              count={products.length}
              hasMore={hasMore}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {hasActiveFilters ? "No products found" : "No products available"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "Check back later for new products or contact us for more information."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-accent1 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}