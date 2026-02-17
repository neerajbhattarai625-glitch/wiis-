import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    AlertCircle,
    ShoppingBag,
    Save,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const AdminMarketplaceManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost: 0,
        stock: 0,
        category: 'eco-friendly',
        image_url: 'https://placehold.co/400'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/marketplace/products`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                cost: product.cost,
                stock: product.stock,
                category: product.category || 'eco-friendly',
                image_url: product.image_url
            });
        } else {
            setCurrentProduct(null);
            setFormData({
                name: '',
                description: '',
                cost: 0,
                stock: 0,
                category: 'eco-friendly',
                image_url: 'https://placehold.co/400'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const method = currentProduct ? 'PUT' : 'POST';
            const endpoint = currentProduct
                ? `${API_URL}/api/admin/products/${currentProduct.id}`
                : `${API_URL}/api/admin/products`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsDialogOpen(false);
                fetchProducts();
            } else {
                const error = await response.json();
                alert(error.detail || "Failed to save product");
            }
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchProducts();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Marketplace Management</h2>
                    <p className="text-muted-foreground">Manage your eco-friendly rewards catalog</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-eco-600 hover:bg-eco-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by product name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                            <div className="h-48 overflow-hidden relative group">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <Badge className="absolute top-2 right-2 bg-white/90 text-eco-700 border-none shadow-sm">
                                    {product.category}
                                </Badge>
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-1 text-eco-600 font-bold">
                                        <ShoppingBag className="h-4 w-4" />
                                        {product.cost} pts
                                    </div>
                                    <div className={`text-sm ${product.stock < 10 ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                                        Stock: {product.stock}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t gap-2 p-3">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(product)}>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-accent/20 rounded-xl border border-dashed">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or add a new product.</p>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the marketplace item.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProduct} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cost">Cost (Points)</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-eco-600 hover:bg-eco-700" disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                {currentProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMarketplaceManagement;
