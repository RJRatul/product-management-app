"use client";

import { Product } from "@/lib/api";
import { useState } from "react";
import { Edit, Trash2, Eye, Image as ImageIcon, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSafeImageUrl, shouldOptimizeImage } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ProductTable({
  products,
  onDelete,
  isLoading,
}: ProductTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
    setMobileMenuOpen(null);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new product.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white shadow-sm rounded-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {mainImage &&
                          !hasError &&
                          mainImage !== "/placeholder-image.jpg" ? (
                            <div className="relative h-12 w-12">
                              <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover rounded"
                                unoptimized={!shouldOptimize}
                                onError={() => handleImageError(mainImage)}
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {product.description}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-1">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name || "No category"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/dashboard/product/${product.slug}`}
                        className="inline-flex text-accent1 hover:text-accent2 p-1"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/edit-product/${product.slug}`}
                        className="inline-flex text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="cursor-pointer inline-flex text-accent3 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
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
            <div key={product.id} className="bg-white shadow-sm rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {mainImage &&
                    !hasError &&
                    mainImage !== "/placeholder-image.jpg" ? (
                      <div className="relative h-16 w-16">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                          unoptimized={!shouldOptimize}
                          onError={() => handleImageError(mainImage)}
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category?.name || "No category"}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-1 truncate">
                      {product.slug}
                    </div>
                  </div>
                </div>
                
                {/* Mobile Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMobileMenuOpen(
                      mobileMenuOpen === product.id ? null : product.id
                    )}
                    className="cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                  
                  {mobileMenuOpen === product.id && (
                    <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border py-1 z-10 min-w-[120px]">
                      <Link
                        href={`/dashboard/product/${product.slug}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(null)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/edit-product/${product.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(null)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="cursor-pointer flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={cancelDelete}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="cursor-pointer px-4 py-2 bg-accent3 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}