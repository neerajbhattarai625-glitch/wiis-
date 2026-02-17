import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Package, Leaf, Search, Filter } from 'lucide-react';
import { marketplace } from '@/services/api';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    image?: string; // Mapped for frontend
    cost: number; // points
    stock: number;
    category: string;
    // UI specific
    rating?: number;
    price?: number; // cash price if applicable, mocked for now
}

const Marketplace = () => {
    const [cart, setCart] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await marketplace.getProducts();
                // Map backend fields to frontend interface if needed
                // Backend: name, description, cost, image_url, stock
                const mappedProducts = response.data.map((p: any) => ({
                    ...p,
                    id: p.id, // Ensure ID is string
                    rating: 4.5, // Mock rating
                    price: p.cost / 10, // Mock cash price
                    image: p.image_url // Map image_url to image
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Failed to load marketplace products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);


    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'personal-care', label: 'Personal Care' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
    ];

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter((p) => p.category === selectedCategory);

    const addToCart = (productId: string) => {
        setCart([...cart, productId]);
    };

    const isInCart = (productId: string) => cart.includes(productId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Eco Marketplace</h2>
                    <p className="text-muted-foreground">Redeem your credit points for sustainable products</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                    <Button variant="default" className="bg-eco-500 hover:bg-eco-600">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cart ({cart.length})
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading products...</div>
            ) : (
                <>

                    {/* Points Balance */}
                    <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Available Points</p>
                                    <p className="text-4xl font-bold mt-1">1,250</p>
                                </div>
                                <Leaf className="h-16 w-16 opacity-20" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Categories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.value}
                                        variant={selectedCategory === category.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.value)}
                                    >
                                        {category.label}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-square overflow-hidden bg-muted">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                                        {product.stock < 15 && (
                                            <Badge variant="warning" className="shrink-0">
                                                Low Stock
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="text-xs line-clamp-2">
                                        {product.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-2xl font-bold text-eco-600">{product.cost}</p>
                                                <p className="text-xs text-muted-foreground">Credit Points</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold">${product.price}</p>
                                                <p className="text-xs text-muted-foreground">or Cash</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{product.rating}</span>
                                            <span className="text-xs text-muted-foreground ml-1">
                                                ({Math.floor(Math.random() * 50) + 10} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Package className="h-3 w-3" />
                                            <span>{product.stock} in stock</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => addToCart(product.id)}
                                        disabled={isInCart(product.id)}
                                    >
                                        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                                    </Button>
                                    <Button className="flex-1 bg-eco-500 hover:bg-eco-600">
                                        Redeem Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Marketplace;
