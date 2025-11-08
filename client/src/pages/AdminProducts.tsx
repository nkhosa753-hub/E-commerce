import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, ShoppingCart, Upload, X, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export default function AdminProducts() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    pricePkr: "",
    categoryId: "",
  });

  useEffect(() => {
    if (!auth.isAuthenticated() || !auth.isAdmin()) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const token = auth.getToken();

  const { data: productsResponse, isLoading: loadingProducts } = useQuery({
    queryKey: ["/api/v1/products"],
    queryFn: () => api.getProducts(),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["/api/v1/categories"],
    queryFn: () => api.getCategories(),
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!token) throw new Error("Not authenticated");
      return api.createProduct(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/products"] });
      toast({
        title: "Product Created",
        description: "Product has been added successfully.",
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error("Not authenticated");
      return api.deleteProduct(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/products"] });
      toast({
        title: "Product Deleted",
        description: "Product has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !token) return;

    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const response = await api.uploadImage(token, file);
        if (response.success && response.data) {
          uploadedUrls.push(response.data.url);
        }
      }
      
      setSelectedImages([...selectedImages, ...uploadedUrls]);
      toast({
        title: "Images Uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      pricePkr: "",
      categoryId: "",
    });
    setSelectedImages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProductMutation.mutate({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      pricePkr: parseInt(formData.pricePkr),
      categoryId: formData.categoryId || null,
      imageUrls: selectedImages,
    });
  };

  const handleLogout = () => {
    auth.logout();
    setLocation("/admin/login");
  };

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover-elevate active-elevate-2 rounded-md">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-primary rounded-md flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">PakShop Admin</span>
            </div>
          </Link>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" data-testid="button-view-site">View Site</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Products</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle data-testid="text-dialog-title">Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the product details and upload images.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Premium Cotton T-Shirt"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-product-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly)</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., premium-cotton-tshirt"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    data-testid="input-product-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2999"
                    value={formData.pricePkr}
                    onChange={(e) => setFormData({ ...formData, pricePkr: e.target.value })}
                    required
                    data-testid="input-product-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    data-testid="textarea-product-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover-elevate cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImages}
                      data-testid="input-image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {uploadingImages ? "Uploading..." : "Click to upload product images"}
                      </p>
                    </label>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                          <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(index)}
                            data-testid={`button-remove-image-${index}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createProductMutation.isPending} data-testid="button-save-product">
                    {createProductMutation.isPending ? "Saving..." : "Save Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle data-testid="text-table-title">All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products yet. Add your first product!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                      <TableCell>
                        <img
                          src={product.images[0]?.url || ""}
                          alt={product.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                      <TableCell>Rs. {product.pricePkr.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            disabled={deleteProductMutation.isPending}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
