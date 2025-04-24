import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowPathIcon,
  FaceSmileIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const Blog = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'GamerPro22',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Cliente Premium'
      },
      date: 'Hace 2 horas',
      content: '¡Mi nueva configuración gaming con los componentes de Yersiman! RTX 4090 + Ryzen 9 7950X. ¿Qué juegos me recomiendan para probarla? 🚀 #GamingSetup',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3',
      likes: 42,
      comments: [
        {
          id: 1,
          author: {
            name: 'TechMaster',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          content: '¡Excelente configuración! Te recomiendo Cyberpunk 2077 con RTX al máximo para probar esa RTX 4090.',
          date: 'Hace 1 hora',
          likes: 5
        },
        {
          id: 2,
          author: {
            name: 'GamingPro',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
          },
          content: 'También podrías probar Microsoft Flight Simulator, se ve increíble con esa configuración.',
          date: 'Hace 30 minutos',
          likes: 3
        }
      ],
      shares: 8,
      tags: ['Gaming', 'Setup', 'Nvidia', 'AMD']
    },
    {
      id: 2,
      author: {
        name: 'TechMaster',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Especialista en Hardware'
      },
      date: 'Ayer',
      content: 'Comparativa de rendimiento entre las nuevas laptops Yersiman XTreme vs. la competencia. Resultados sorprendentes en pruebas de estrés! 💻🔥',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3',
      likes: 89,
      comments: [
        {
          id: 1,
          author: {
            name: 'LaptopLover',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
          },
          content: '¿Podrías hacer una comparativa con la nueva MacBook Pro M2?',
          date: 'Hace 5 horas',
          likes: 2
        }
      ],
      shares: 12,
      tags: ['Laptops', 'Benchmark', 'Rendimiento']
    },
    {
      id: 3,
      author: {
        name: 'CreativeDesign',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        role: 'Diseñadora Gráfica'
      },
      date: 'Hace 3 días',
      content: 'La workstation Yersiman Pro ha reducido mis tiempos de renderizado en un 40%! Alguien más la usa para After Effects? 🎬 #Productividad',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3',
      likes: 56,
      comments: [
        {
          id: 1,
          author: {
            name: 'DesignPro',
            avatar: 'https://randomuser.me/api/portraits/men/89.jpg'
          },
          content: 'Yo también la uso para After Effects y Premiere. Los tiempos de renderizado son increíbles.',
          date: 'Hace 2 días',
          likes: 4
        }
      ],
      shares: 5,
      tags: ['Workstation', 'Diseño', 'Render']
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      author: {
        name: 'Yo',
        avatar: 'https://randomuser.me/api/portraits/lego/7.jpg',
        role: 'Usuario'
      },
      date: 'Ahora mismo',
      content: newPost,
      image: selectedImage,
      likes: 0,
      comments: [],
      shares: 0,
      tags: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId, comment) => {
    if (!comment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: post.comments.length + 1,
          author: {
            name: 'Yo',
            avatar: 'https://randomuser.me/api/portraits/lego/7.jpg'
          },
          content: comment,
          date: 'Ahora mismo',
          likes: 0
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const filters = ['Todos', 'Gaming', 'Laptops', 'Workstations', 'Componentes', 'Ofertas', 'Setup'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Comunidad Yersiman
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Comparte tus experiencias, haz preguntas y conecta con otros usuarios
            </p>
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="¿Qué quieres compartir con la comunidad?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <PhotoIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400" />
                </label>
                <FaceSmileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400" />
                <VideoCameraIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400" />
              </div>
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.author.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {post.date}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-900 dark:text-white">
                    {post.content}
                  </p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="mt-4 rounded-lg w-full h-64 object-cover"
                    />
                  )}
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                    >
                      <HandThumbUpIcon className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                      <ShareIcon className="h-5 w-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-4">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {comment.author.name}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {comment.date}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center space-x-4">
                            <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                              Me gusta
                            </button>
                            <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                              Responder
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start space-x-4">
                      <img
                        src="https://randomuser.me/api/portraits/lego/7.jpg"
                        alt="Tu avatar"
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Escribe un comentario..."
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;