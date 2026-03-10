import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await blogService.getAdminPosts({ status: activeTab });
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Error al cargar los posts');
      toast.error('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (postId, newStatus) => {
    try {
      await blogService.updatePostStatus(postId, newStatus);
      toast.success(`Post ${newStatus === 'approved' ? 'aprobado' : 'rechazado'} correctamente`);
      await loadPosts();
    } catch (err) {
      console.error('Error updating post status:', err);
      toast.error('Error al actualizar el estado del post');
    }
  };

  if (!profile?.role?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-200">No tienes permiso para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administración de Posts</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['pending', 'approved', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
           {loading ? (
    <div className="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner size="lg" color="gradient" />
    </div>
  ) : error ? (
              <div className="text-red-600 dark:text-red-400 py-4 text-center">{error}</div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.profiles?.avatar_url || 'https://via.placeholder.com/40'}
                          alt={post.profiles?.nombre}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {post.profiles?.nombre} {post.profiles?.apellido}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {activeTab !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(post.id, 'approved')}
                            className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          >
                            Aprobar
                          </button>
                        )}
                        {activeTab !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(post.id, 'rejected')}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            Rechazar
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                    {post.image_url && (
                      <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 flex justify-center max-h-64">
                        <img
                          src={post.image_url}
                          alt="Post content"
                          className="max-w-full object-contain"
                        />
                      </div>
                    )}
                    {post.video_url && (
                      <div className="mt-4 rounded-lg overflow-hidden bg-black flex justify-center max-h-64">
                        <video
                          src={post.video_url}
                          controls
                          className="max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No hay posts {activeTab === 'pending' ? 'pendientes' : activeTab === 'approved' ? 'aprobados' : 'rechazados'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPosts;