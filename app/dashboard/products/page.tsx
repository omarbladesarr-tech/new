import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const sampleProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      sku: 'WH-1000XM4',
      supplier: 'TechSupplies Inc',
      price: 349.99,
      cost: 199.99,
      stock: 45,
      status: 'active',
      created_at: '2024-03-10',
    },
    {
      id: 2,
      name: 'Portable Bluetooth Speaker',
      sku: 'BS-500',
      supplier: 'Audio World',
      price: 89.99,
      cost: 45.00,
      stock: 120,
      status: 'active',
      created_at: '2024-03-09',
    },
    {
      id: 3,
      name: 'USB-C Fast Charging Cable',
      sku: 'CABLE-C',
      supplier: 'Cable Works',
      price: 24.99,
      cost: 8.50,
      stock: 300,
      status: 'active',
      created_at: '2024-03-08',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-2">Manage your product catalog and inventory</p>
        </div>
        <Button>Add Product</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: '156', change: '+12 this month' },
          { label: 'Active Listings', value: '148', change: '8 inactive' },
          { label: 'Total Inventory', value: '2,340', change: 'units' },
          { label: 'Revenue Potential', value: '$145,320', change: 'This quarter' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Product Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">SKU</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Supplier</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Price</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Cost</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Stock</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-slate-400">{product.sku}</td>
                    <td className="py-3 px-4 text-slate-400">{product.supplier}</td>
                    <td className="py-3 px-4 text-right text-white">${product.price}</td>
                    <td className="py-3 px-4 text-right text-slate-400">${product.cost}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${product.stock > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-slate-400 hover:text-white transition">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Inventory Alerts */}
      <Card className="mt-6 bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Inventory Alerts</h2>
        <div className="space-y-3">
          {[
            { product: 'USB-C Cable', alert: 'Stock running low', stock: 15, color: 'text-yellow-400' },
            { product: 'Phone Case', alert: 'Out of stock', stock: 0, color: 'text-red-400' },
          ].map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
              <div>
                <p className="font-medium text-white">{alert.product}</p>
                <p className={`text-sm ${alert.color}`}>{alert.alert}</p>
              </div>
              <Button variant="outline" size="sm">
                Reorder
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
