"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product, apiService } from "@/lib/api";
import { ProductFormData } from "@/lib/validations";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to get product by ID
        const productData = await apiService.getProduct(id);
        setProduct(productData);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    setSubmitting(true);
    setError("");

    try {
      // Filter out blob URLs and empty strings, keep existing valid URLs
      const validImages = data.images.filter(
        (img) => img.trim() !== "" && !img.startsWith("blob:")
      );

      if (validImages.length === 0) {
        throw new Error("At least one valid image URL is required");
      }

      const updateData = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: validImages,
      };

      await apiService.updateProduct(product!.id, updateData);
      router.push("/dashboard/products");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Product not found
        </div>
      </div>
    );
  }

  // Transform product data to form data
  const initialFormData: ProductFormData = {
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.category.id,
    images: product.images,
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          href="/dashboard/products"
          className="flex items-center text-accent2 hover:text-amber-600 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        loading={submitting}
        error={error}
        initialData={initialFormData}
        submitButtonText="Update Product"
      />
    </div>
  );
}
