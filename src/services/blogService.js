import { supabase } from '../config/supabase';

export const blogService = {
  async updatePostStatus(postId, newStatus) {
    const { data, error } = await supabase
      .from('posts')
      .update({ status: newStatus })
      .eq('id', postId)
      .select();

    if (error) throw error;
    return data;
  },
  async getAdminPosts({ status }) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          nombre,
          avatar_url
        )
      `)
      .eq('status', status);

    if (error) throw error;
    return { success: true, data };
  },
  async getPosts({ page = 1, limit = 10 }) {
    const start = (page - 1) * limit;
    const end = page * limit - 1;

    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('posts')
      .select(
        `*,
        author:profiles!user_id(*),
        post_likes(user_id),
        post_comments(id, content, created_at, profiles!user_id(*)),
        post_shares(user_id)`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(start, end);

    if (user) {
      query = query.or(`status.eq.approved,user_id.eq.${user.id}`);
    } else {
      query = query.eq('status', 'approved');
    }

    const { data, count, error } = await query;

    if (error) throw error;
    return { data, count };
  },

  async getPostById(id) {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('posts')
      .select(
        `*,
        author:profiles!user_id(*),
        post_likes(user_id),
        post_comments(id, content, created_at, profiles!user_id(*)),
        post_shares(user_id)`
      )
      .eq('id', id);

    if (user) {
      query = query.or(`status.eq.approved,user_id.eq.${user.id}`);
    } else {
      query = query.eq('status', 'approved');
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  },

  async createPost(postData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const payload = {
      ...postData,
      user_id: user.id,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([payload]);

    if (error) throw error;
    return data;
  },

  async updatePost(postId, updateData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    // Verificar que el usuario es el autor o admin
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (!post) throw new Error('Post no encontrado');
    if (post.user_id !== user.id && user.role !== 'admin') {
      throw new Error('No autorizado');
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select();

    if (error) throw error;
    return data;
  },

  async deletePost(postId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    // Verificar que el usuario es el autor o admin
    const { data: post } = await supabase
      .from('posts')
      .select('user_id, image_url, video_url')
      .eq('id', postId)
      .single();

    if (!post) throw new Error('Post no encontrado');
    if (post.user_id !== user.id && user.role !== 'admin') {
      throw new Error('No autorizado');
    }

    // Eliminar archivos asociados primero
    try {
      if (post.image_url) {
        const imagePath = post.image_url.split('/object/public/')[1];
        await supabase.storage
          .from('blog-images')
          .remove([imagePath]);
      }
      if (post.video_url) {
        const videoPath = post.video_url.split('/object/public/')[1];
        await supabase.storage
          .from('blog-videos')
          .remove([videoPath]);
      }
    } catch (error) {
      console.warn('Error eliminando archivos multimedia:', error);
    }

    // Eliminar el post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  },

  async toggleLike(postId, userId) {
    const { data, error } = await supabase
      .from('post_likes')
      .upsert({ post_id: postId, user_id: userId }, { onConflict: ['post_id', 'user_id'] })
      .single();

    if (error && error.code === '23505') {
      await supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: userId });
      return null;
    }

    if (error) throw error;
    return data;
  },

  async addComment(commentData) {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([commentData]);

    if (error) throw error;
    return data;
  },

  async sharePost(postId, userId) {
    const { data, error } = await supabase
      .from('post_shares')
      .insert([{ post_id: postId, user_id: userId }]);

    if (error) throw error;
    return data;
  }
};