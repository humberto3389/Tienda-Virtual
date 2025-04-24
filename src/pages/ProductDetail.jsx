import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-hot-toast'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { HeartIcon } from '@heroicons/react/24/outline'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const productData = await productService.getProductById(id)
        if (!productData) {
          setError('Producto no encontrado')
          return
        }
        setProduct(productData)

        await productService.incrementProductViews(id)

        const categories = await categoryService.getAllCategories()
        const productCategory = categories.find(cat => cat.id === productData.categoryId)
        setCategory(productCategory)

        setError(null)
      } catch (err) {
        setError('Error al cargar el producto')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAddToCart = () => {
    // Implement the logic to add the product to the cart
    console.log('Añadiendo al carrito:', product)
  }

  const handleAddToWishlist = () => {
    // Implement the logic to add the product to the wishlist
    console.log('Añadiendo a la lista de deseos:', product)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === image ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="px-2 py-1 text-sm font-medium text-white bg-red-500 dark:bg-red-600 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Color
                  </h3>
                  <div className="mt-2 flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`relative p-0.5 rounded-full ${
                          selectedColor.name === color.name
                            ? 'ring-2 ring-indigo-500'
                            : ''
                        }`}
                      >
                        <span
                          className="block w-8 h-8 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Talla
                  </h3>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          selectedSize === size
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Cantidad
                  </h3>
                  <div className="mt-2 flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      -
                    </button>
                    <span className="text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Añadiendo...' : 'Añadir al carrito'}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Detalles del producto
                </h3>
                <div className="mt-4 prose prose-sm text-gray-600 dark:text-gray-300">
                  <ul className="list-disc pl-4 space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}