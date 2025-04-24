import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, EyeIcon, HeartIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getBlogPostById(id);
        if (!data) {
          setError('Artículo no encontrado');
          return;
        }
        setPost(data);
        await blogService.incrementBlogViews(id);
        setError(null);
      } catch (err) {
        setError('Error al cargar el artículo');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      await blogService.addBlogLike(id);
      setPost(prev => ({
        ...prev,
        likes: prev.likes + 1
      }));
    } catch (err) {
      console.error('Error al dar like:', err);
    }
  };

  const handleComment = async (comment) => {
    try {
      await blogService.addBlogComment(id, comment);
      const updatedPost = await blogService.getBlogPostById(id);
      setPost(updatedPost);
    } catch (err) {
      console.error('Error al agregar comentario:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
            <div className="h-96 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Inicio
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <Link to="/blog" className="ml-1 text-gray-700 hover:text-indigo-600 md:ml-2">
                Blog
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">{post.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {post.views} vistas
            </div>
            <div className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-1" />
              {post.likes} me gusta
            </div>
          </div>
        </header>

        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        <div className="prose prose-lg max-w-none mb-8">
          {post.content}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleLike}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            Me gusta
          </button>
        </div>

        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comentarios</h2>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleComment({
              userName,
              comment: comment.trim(),
              date: new Date().toISOString()
            });
          }} className="mb-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Comentario
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Publicar comentario
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-6">
            <BlogComments comments={post.comments} />
          </div>
        </section>
      </article>
    </div>
  );
};

export default BlogDetail; 