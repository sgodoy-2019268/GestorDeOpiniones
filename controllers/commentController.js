import Comment from '../models/comment.js';
import Post from '../models/post.js';
import jwt from 'jsonwebtoken'

export const createComment = async (req, res) => {
    try {
        const { contenido } = req.body;
        const { postId } = req.params;

         let token = req.headers.authorization
         let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
         let userId = decodeToken.id

        const comment = new Comment({
            contenido,
            autor: userId,
        });

        await comment.save();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }
        post.comentarios.push(comment._id);
        await post.save();

        res.status(201).send({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const updateComment = async (req, res) => {
    try {
        let { commentId } = req.params;
        console.log(commentId)
        let { contenido } = req.body;

        let comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to update this comment' });
        }

        comment.contenido = contenido;
        comment.updatedAt = new Date(); 

        await comment.save();

        res.send({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Post not found' });
        }
        if (comment.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }

        await Comment.findByIdAndDelete(commentId);

        res.send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
