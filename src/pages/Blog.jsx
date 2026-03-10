import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  FaceSmileIcon,
  VideoCameraIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { blogService } from '../services/blogService';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/auth/AuthContext';
import { toast } from 'react-hot-toast';
import BlogPagination from '../components/ui/BlogPagination';
import EmojiPicker from 'emoji-picker-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [editedImageUrl, setEditedImageUrl] = useState(null);
  const [editedVideo, setEditedVideo] = useState(null);
  const [editedVideoUrl, setEditedVideoUrl] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  
  const emojiPickerRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const POSTS_PER_PAGE = 10;

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      [selectedVideo, editedVideo].forEach(video => {
        if (video) URL.revokeObjectURL(video);
      });
      [selectedImage, editedImage].forEach(image => {
        if (image) URL.revokeObjectURL(image);
      });
    };
  }, [selectedVideo, selectedImage, editedVideo, editedImage]);

  const loadPosts = async (page = currentPage) => {
    try {
      setLoading(true);
      const { data, count } = await blogService.getPosts({
        page,
        limit: POSTS_PER_PAGE
      });
      
      setPosts(Array.isArray(data) ? data : []);
      setTotalPages(Math.ceil((count || 0) / POSTS_PER_PAGE));
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    try {
      setLoading(true);
      const [imageUrl, videoUrl] = await Promise.all([
        selectedImage ? storageService.uploadImage(selectedImage) : null,
        selectedVideo ? storageService.uploadVideo(selectedVideo) : null
      ]);

      await blogService.createPost({
        content: newPost,
        image_url: imageUrl,
        video_url: videoUrl
      });

      setNewPost('');
      setSelectedImage(null);
      setSelectedVideo(null);
      toast.success('Post creado. Estará visible cuando un administrador lo apruebe.');
      await loadPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('¿Estás seguro de eliminar este post?')) return;
    
    try {
      await blogService.deletePost(postId);
      toast.success('Post eliminado correctamente');
      await loadPosts();
    } catch (err) {
      toast.error(err.message || 'Error al eliminar el post');
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditedContent(post.content);
    setEditedImage(null);
    setEditedVideo(null);
    setShowOptionsMenu(null);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditedContent('');
    setEditedImage(null);
    setEditedVideo(null);
  };

  const saveEdit = async (postId) => {
    try {
      const updateData = { content: editedContent };
      
      if (editedImage || editedVideo) {
        const [imageUrl, videoUrl] = await Promise.all([
          editedImage ? storageService.uploadImage(editedImage) : null,
          editedVideo ? storageService.uploadVideo(editedVideo) : null
        ]);
        
        if (imageUrl) updateData.image_url = imageUrl;
        if (videoUrl) updateData.video_url = videoUrl;
      }

      await blogService.updatePost(postId, updateData);
      toast.success('Post actualizado correctamente');
      cancelEditing();
      await loadPosts();
    } catch (err) {
      toast.error(err.message || 'Error al actualizar el post');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe exceder 5MB');
      return;
    }

    // Mostrar información sobre la compresión
    if (file.size > 1 * 1024 * 1024) {
      toast.success('La imagen será comprimida automáticamente para optimizar el almacenamiento', {
        duration: 4000,
        icon: '🖼️'
      });
    }

    const url = URL.createObjectURL(file);
    setSelectedImage(file);
    setSelectedImageUrl(url);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const supportedFormats = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!supportedFormats.includes(file.type)) {
      toast.error('Formato no soportado. Use MP4, WEBM u OGG');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('El video no debe exceder 25MB');
      return;
    }

    // Mostrar información sobre la compresión
    if (file.size > 5 * 1024 * 1024) {
      toast.success('El video será comprimido automáticamente para optimizar el almacenamiento', {
        duration: 4000,
        icon: '🎬'
      });
    }

    const url = URL.createObjectURL(file);
    setSelectedVideo(file);
    setSelectedVideoUrl(url);
    toast.success('Video seleccionado correctamente');
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe exceder 5MB');
      return;
    }

    // Mostrar información sobre la compresión
    if (file.size > 1 * 1024 * 1024) {
      toast.success('La imagen será comprimida automáticamente para optimizar el almacenamiento', {
        duration: 4000,
        icon: '🖼️'
      });
    }

    const url = URL.createObjectURL(file);
    setEditedImage(file);
    setEditedImageUrl(url);
  };

  const handleEditVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const supportedFormats = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!supportedFormats.includes(file.type)) {
      toast.error('Formato no soportado. Use MP4, WEBM u OGG');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('El video no debe exceder 25MB');
      return;
    }

    // Mostrar información sobre la compresión
    if (file.size > 5 * 1024 * 1024) {
      toast.success('El video será comprimido automáticamente para optimizar el almacenamiento', {
        duration: 4000,
        icon: '🎬'
      });
    }

    const url = URL.createObjectURL(file);
    setEditedVideo(file);
    setEditedVideoUrl(url);
    toast.success('Video seleccionado para edición');
  };

  const handleEmojiSelect = (emoji) => {
    if (editingPostId) {
      setEditedContent(prev => prev + emoji.emoji);
    } else {
      setNewPost(prev => prev + emoji.emoji);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      await blogService.toggleLike(postId, user.id);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComment = async (postId, comment) => {
    if (!comment.trim() || !user) return;
    try {
      await blogService.addComment({ post_id: postId, user_id: user.id, content: comment });
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShare = async (postId) => {
    if (!user) return;
    try {
      await blogService.sharePost(postId, user.id);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPostContent = (post) => {
    if (editingPostId === post.id) {
      return (
        <div className="mt-6 p-6 bg-gray-50/50 dark:bg-white/[0.02] rounded-[2rem] border border-gray-100 dark:border-white/5 animate-fade-in">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-lg font-light text-black dark:text-white placeholder-gray-400 min-h-[120px] py-2 resize-none"
            rows="4"
          />
          
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white dark:bg-[#18181b] text-xs font-bold tracking-widest text-gray-400 hover:text-indigo-500 border border-gray-100 dark:border-white/5 rounded-full transition-all flex items-center gap-2"
            >
              <PhotoIcon className="h-4 w-4" />
              IMAGEN
            </button>
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="px-4 py-2 bg-white dark:bg-[#18181b] text-xs font-bold tracking-widest text-gray-400 hover:text-purple-500 border border-gray-100 dark:border-white/5 rounded-full transition-all flex items-center gap-2"
            >
              <VideoCameraIcon className="h-4 w-4" />
              VIDEO
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            {editedImageUrl && (
              <div className="relative group/edit">
                <img
                  src={editedImageUrl}
                  alt="Nueva imagen"
                  className="rounded-2xl w-24 h-24 object-cover border border-gray-100 dark:border-white/10"
                />
                <button
                  onClick={() => { URL.revokeObjectURL(editedImageUrl); setEditedImage(null); setEditedImageUrl(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover/edit:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {editedVideoUrl && (
              <div className="relative group/editv">
                <video
                  src={editedVideoUrl}
                  className="rounded-2xl w-24 h-24 object-cover border border-gray-100 dark:border-white/10"
                  muted
                />
                <button
                  onClick={() => { URL.revokeObjectURL(editedVideoUrl); setEditedVideo(null); setEditedVideoUrl(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover/editv:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {post.image_url && !editedImage && (
              <div className="relative">
                <img
                  src={post.image_url}
                  alt="Actual"
                  className="rounded-2xl w-24 h-24 object-cover border-2 border-indigo-500/50 opacity-60"
                />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-indigo-500 tracking-tighter uppercase pointer-events-none">
                  Actual
                </span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 mt-8">
            <button
              onClick={() => saveEdit(post.id)}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all"
            >
              GUARDAR CAMBIOS
            </button>
            <button
              onClick={cancelEditing}
              className="px-6 py-2 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-black tracking-widest rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              CANCELAR
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <Link to={`/blog/${post.id}`} className="block group">
        <p className="mt-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-pre-line">
          {post.content}
        </p>
        
        {post.image_url && (
          <div className="mt-4 relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 flex justify-center">
            <img
              src={post.image_url}
              alt="Post content"
              className="max-w-full max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}
        
        {post.video_url && (
          <div className="mt-4 relative overflow-hidden rounded-xl bg-black flex justify-center">
            <video
              src={post.video_url}
              controls
              className="max-w-full max-h-[600px]"
              playsInline
            />
          </div>
        )}
      </Link>
    );
  };

  const renderOptionsMenu = (post) => {
    return (
      <div 
        ref={optionsMenuRef}
        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
      >
        <div className="py-1">
          {(user?.id === post.user_id || user?.role === 'admin') && (
            <>
              <button
                onClick={() => startEditing(post)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPostOptions = (post) => {
    if (user?.id === post.user_id || user?.role === 'admin') {
      return (
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowOptionsMenu(showOptionsMenu === post.id ? null : post.id);
            }}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
          {showOptionsMenu === post.id && renderOptionsMenu(post)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#080808] selection:bg-indigo-500/30 transition-colors duration-700">
      {/* 1. HERO / HEADER SECTION */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[10px] tracking-[0.5em] font-medium text-indigo-500 uppercase block mb-6 animate-fade-in">
            Espacio de Comunidad
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-black dark:text-white tracking-tighter leading-tight mb-8">
            Yersiman <span className="font-semibold italic">Connect.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            Descubre historias, comparte innovaciones y conecta con la comunidad tecnológica más vibrante.
          </p>
        </div>
      </div>

      {/* 2. CREATION & FEED SECTION */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* Create Post Bar/Card */}
        {user && (
          <div className="mb-20">
            <div className="group relative bg-[#fdfaf6] dark:bg-[#111] border border-[#e8e4db] dark:border-white/5 rounded-[3rem] p-4 shadow-xl shadow-stone-200/50 dark:shadow-none transition-all duration-500">
              <div className="px-8 pt-6 pb-2">
                <span className="text-[9px] font-black tracking-[0.5em] text-indigo-500 uppercase">
                  NUEVA PUBLICACIÓN
                </span>
              </div>
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-start gap-6 p-8">
                  <div className="relative">
                    <img 
                      src={profile?.avatar_url || 'https://via.placeholder.com/48'} 
                      alt="User" 
                      className="w-14 h-14 rounded-full border border-[#e8e4db] dark:border-white/10 object-cover shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#fdfaf6] dark:border-[#111]"></div>
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Comparte tu experiencia con nosotros..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-light text-black dark:text-white placeholder-stone-300 min-h-[120px] py-2 resize-none"
                  />
                </div>

                {/* Multimedia Previews */}
                {(selectedImageUrl || selectedVideoUrl) && (
                  <div className="flex flex-wrap gap-6 px-10 pb-8">
                    {selectedImageUrl && (
                      <div className="relative group/img shadow-2xl rounded-3xl overflow-hidden border-4 border-white dark:border-white/5">
                        <img src={selectedImageUrl} alt="Preview" className="w-32 h-40 object-cover" />
                        <button onClick={() => { setSelectedImage(null); setSelectedImageUrl(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <XMarkIcon className="h-8 w-8 text-white" />
                        </button>
                      </div>
                    )}
                    {selectedVideoUrl && (
                      <div className="relative group/vid shadow-2xl rounded-3xl overflow-hidden border-4 border-white dark:border-white/5">
                        <video src={selectedVideoUrl} className="w-32 h-40 object-cover" muted />
                        <button onClick={() => { URL.revokeObjectURL(selectedVideoUrl); setSelectedVideo(null); setSelectedVideoUrl(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 transition-opacity">
                          <XMarkIcon className="h-8 w-8 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between px-10 py-6 border-t border-[#e8e4db] dark:border-white/5 bg-white/40 dark:bg-white/[0.01] rounded-b-[3rem]">
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white dark:bg-[#18181b] text-stone-400 hover:text-indigo-500 border border-[#e8e4db] dark:border-white/5 rounded-2xl transition-all hover:shadow-lg">
                      <PhotoIcon className="h-5 w-5" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
                    </button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="p-3 bg-white dark:bg-[#18181b] text-stone-400 hover:text-purple-500 border border-[#e8e4db] dark:border-white/5 rounded-2xl transition-all hover:shadow-lg">
                      <VideoCameraIcon className="h-5 w-5" />
                      <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" ref={videoInputRef} />
                    </button>
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3 bg-white dark:bg-[#18181b] text-stone-400 hover:text-yellow-500 border border-[#e8e4db] dark:border-white/5 rounded-2xl transition-all hover:shadow-lg">
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newPost.trim() || loading}
                    className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                  >
                    {loading ? 'PUBLICANDO...' : 'PUBLICAR'}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute left-10 bottom-24 z-30 animate-fade-in shadow-2xl rounded-3xl overflow-hidden">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} theme="auto" />
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Blog Feed */}
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-sm animate-pulse">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/20">
            <p className="text-red-500 dark:text-red-400 font-medium">Error al conectar con la comunidad: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts?.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="group bg-[#fdfaf6] dark:bg-[#111] border border-[#e8e4db] dark:border-white/5 rounded-[3rem] overflow-hidden shadow-xl shadow-stone-200/50 dark:shadow-none hover:translate-y-[-8px] transition-all duration-700 flex flex-col">
                  {/* Decorative Card Header */}
                  <div className="px-10 pt-10 pb-6 flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-[0.4em] text-stone-400 dark:text-stone-500 uppercase">
                      COMUNIDAD <span className="text-indigo-500">·</span> CONNECT
                    </span>
                    <div className="flex gap-1.5 align-center">
                      <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                      <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                      <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                    </div>
                  </div>

                  {/* Framed Multimedia Section */}
                  <div className="px-6 relative">
                    {/* Post Options (Ellipsis) */}
                    <div className="absolute top-10 right-10 z-20">
                      {renderPostOptions(post)}
                    </div>

                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 bg-white dark:bg-black/40 aspect-[4/5] relative">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : post.video_url ? (
                        <video
                          src={post.video_url}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                          loop
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-white/[0.02]">
                           <span className="text-stone-300 font-black text-6xl opacity-20">Y</span>
                        </div>
                      )}
                      
                      {post.status === 'pending' && (
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-full text-[9px] font-bold tracking-widest uppercase border border-white/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pendiente
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    {/* Horizontal Interaction Bar */}
                    <div className="flex items-center space-x-6 mb-8 text-stone-600 dark:text-stone-400">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`transition-all duration-300 hover:scale-125 ${post.post_likes?.some(like => like.user_id === user?.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                      >
                        <HandThumbUpIcon className="h-6 w-6" />
                      </button>
                      <button className="transition-all duration-300 hover:scale-125 hover:text-indigo-500">
                        <ChatBubbleLeftIcon className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="transition-all duration-300 hover:scale-125 hover:text-purple-500"
                      >
                        <ShareIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-10 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black dark:text-white uppercase tracking-wider">
                          {post.author?.nombre}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                        <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {editingPostId === post.id ? (
                        renderPostContent(post)
                      ) : (
                        <Link to={`/blog/${post.id}`} className="block group/content">
                          <p className="text-xl font-light text-stone-800 dark:text-stone-300 leading-relaxed line-clamp-3">
                            {post.content}
                          </p>
                        </Link>
                      )}
                    </div>

                    {/* Footer / Link to detail */}
                    <div className="mt-auto pt-6 border-t border-stone-200 dark:border-white/5 flex justify-between items-center group/footer">
                      <Link 
                        to={`/blog/${post.id}`}
                        className="text-[10px] font-black text-stone-400 dark:text-stone-500 tracking-[0.3em] uppercase group-hover/footer:text-indigo-500 transition-colors"
                      >
                        VER EXPERIENCIA COMPLETA
                      </Link>
                      <div className="flex -space-x-2">
                        {post.post_likes?.slice(0, 3).map((like, i) => (
                           <div key={i} className="w-6 h-6 rounded-full border-2 border-[#fdfaf6] dark:border-[#111] bg-stone-200 overflow-hidden">
                              <img src={`https://i.pravatar.cc/150?u=${like.user_id}`} className="w-full h-full object-cover" alt="interact" />
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <p className="text-stone-400 font-light">No hay experiencias que mostrar todavía.</p>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-20 flex justify-center">
            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;