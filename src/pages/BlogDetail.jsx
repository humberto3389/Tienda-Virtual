import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChatBubbleLeftIcon, 
  HandThumbUpIcon, 
  ShareIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { blogService } from '../services/blogService';
import { useAuth } from '../context/auth/AuthContext';
import { toast } from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const { user, profile } = useAuth();

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await blogService.getPostById(id);
      
      if (!data) {
        setError('Post no encontrado');
        return;
      }
      
      setPost(data);
    } catch (err) {
      console.error('Error loading post:', err);
      setError(err.message || 'Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para dar me gusta');
      return;
    }

    try {
      await blogService.toggleLike(post.id, user.id);
      await loadPost();
    } catch (err) {
      toast.error(err.message || 'Error al dar me gusta');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await blogService.addComment({
        post_id: post.id,
        user_id: user.id,
        content: newComment
      });
      setNewComment('');
      await loadPost();
      toast.success('Comentario añadido');
    } catch (err) {
      toast.error(err.message || 'Error al comentar');
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para compartir');
      return;
    }

    try {
      await blogService.sharePost(post.id, user.id);
      await loadPost();
      toast.success('Post compartido');
    } catch (err) {
      toast.error(err.message || 'Error al compartir');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Post no encontrado'}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Volver al blog
          </Link>
        </nav>

        <article className="bg-[#fdfaf6] dark:bg-[#111] border border-[#e8e4db] dark:border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700">
          <div className="p-10 md:p-20">
            {/* Editorial Header */}
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[10px] tracking-[0.6em] font-black text-indigo-500 uppercase mb-6">
                YERSIMAN EXPERIENCES
              </span>
              <div className="flex items-center space-x-4 mb-4">
                 <img
                    src={post.author?.avatar_url || 'https://via.placeholder.com/48'}
                    alt={post.author?.nombre}
                    className="h-12 w-12 rounded-full border border-[#e8e4db] dark:border-white/10"
                  />
                  <div className="text-left">
                    <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
                      {post.author?.nombre} {post.author?.apellido}
                    </h2>
                    <p className="text-[10px] text-stone-400 font-medium tracking-widest uppercase mt-0.5">
                      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
              </div>
            </div>

            <div className="space-y-16">
              {/* Main Media with Padding (Canva Style) */}
              {(post.image_url || post.video_url) && (
                <div className="p-4 md:p-8 bg-white dark:bg-black/20 rounded-[3rem] shadow-inner border border-[#e8e4db] dark:border-white/5">
                  <div className="rounded-[2rem] overflow-hidden shadow-2xl">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full h-auto max-h-[700px] object-contain"
                        loading="lazy"
                      />
                    )}
                    {post.video_url && (
                      <video
                        src={post.video_url}
                        controls
                        className="w-full h-auto max-h-[700px]"
                        playsInline
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Interaction Bar (Instagram Style) */}
              <div className="flex items-center space-x-10 py-6 border-y border-[#e8e4db] dark:border-white/5 justify-center md:justify-start">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-3 transition-all duration-300 hover:scale-110 ${post.post_likes?.some(like => like.user_id === user?.id) ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}
                  >
                    <HandThumbUpIcon className="h-7 w-7" />
                    <span className="text-sm font-black">{post.post_likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-3 text-stone-400 transition-all duration-300 hover:scale-110 hover:text-indigo-500">
                    <ChatBubbleLeftIcon className="h-7 w-7" />
                    <span className="text-sm font-black">{post.post_comments?.length || 0}</span>
                  </button>
              </div>

              <div className="prose prose-2xl dark:prose-invert max-w-none">
                <p className="text-stone-800 dark:text-stone-200 font-light leading-[1.8] whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-indigo-600">
                  {post.content}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${post.post_likes?.some(like => like.user_id === user?.id) ? 'text-indigo-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <HandThumbUpIcon className="h-5 w-5" />
                  <span>{post.post_likes?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{post.post_comments?.length || 0}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>{post.post_shares?.length || 0}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Comentarios ({post.post_comments?.length || 0})
              </h3>

              {user && (
                <form onSubmit={handleComment} className="mb-8">
                  <div className="flex items-start space-x-4">
                    <img
                      src={profile?.avatar_url || 'https://via.placeholder.com/32'}
                      alt="Tu avatar"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        rows="3"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {post.post_comments?.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <img
                      src={comment.profiles?.avatar_url || 'https://via.placeholder.com/32'}
                      alt={comment.profiles?.nombre}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.profiles?.nombre} {comment.profiles?.apellido}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;