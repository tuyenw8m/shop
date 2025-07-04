"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Trash2, Star } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  product_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  images?: string[]
  created_at: string
}

interface Product {
  id: string
  name: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [productFilter, setProductFilter] = useState("")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (productFilter) {
      fetchReviews()
    }
  }, [pagination.page, searchTerm, ratingFilter, productFilter])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts({ limit: 100 })
      if (response.status === "success") {
        setProducts(response.data.content)
        if (response.data.content.length > 0) {
          setProductFilter(response.data.content[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchReviews = async () => {
    if (!productFilter) return

    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.size,
        ...(searchTerm && { search: searchTerm }),
        ...(ratingFilter && ratingFilter !== "all" && { rating: ratingFilter }),
      }

      const response = await apiClient.getProductReviews(productFilter, params)

      if (response.status === "success") {
        setReviews(response.data.content)
        setPagination((prev) => ({
          ...prev,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      await apiClient.deleteReview(id)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const openDetailDialog = (review: Review) => {
    setSelectedReview(review)
    setIsDetailDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>View and manage product reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id || "default"}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{review.user_name}</div>
                          <div className="text-sm text-muted-foreground">ID: {review.user_id.substring(0, 8)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm">{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{review.comment}</div>
                      </TableCell>
                      <TableCell>{formatDate(review.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openDetailDialog(review)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReview(review.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.size + 1} to{" "}
              {Math.min(pagination.page * pagination.size, pagination.totalElements)} of {pagination.totalElements}{" "}
              reviews
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>View detailed information about this review</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>User:</strong> {selectedReview.user_name}
                </div>
                <div>
                  <strong>User ID:</strong> {selectedReview.user_id.substring(0, 8)}
                </div>
                <div>
                  <strong>Rating:</strong>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(selectedReview.rating)}
                    <span className="ml-2">{selectedReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <strong>Date:</strong> {formatDate(selectedReview.created_at)}
                </div>
              </div>

              <div>
                <strong>Comment:</strong>
                <p className="mt-2 p-3 bg-muted rounded-md">{selectedReview.comment}</p>
              </div>

              {selectedReview.images && selectedReview.images.length > 0 && (
                <div>
                  <strong>Images:</strong>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedReview.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
