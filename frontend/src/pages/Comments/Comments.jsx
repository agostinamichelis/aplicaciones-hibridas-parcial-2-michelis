import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Comments.scss';

const Comment = ({ recipeId }) => {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recipeId) {
            fetchComments();
        }
    }, [recipeId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/comments/${recipeId}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Error al cargar los comentarios.');
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;
        try {
            const response = await axios.post('http://localhost:3000/comments', {
                recipeId,
                userId: user._id,
                username: user.username,
                content: newComment,
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
            setError('Error al crear el comentario.');
        }
    };

    const handleEditCommentChange = (e) => {
        setEditingCommentContent(e.target.value);
    };

    const handleEditCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/comments/${editingCommentId}`, {
                content: editingCommentContent,
            });
            setComments(comments.map(comment => comment._id === editingCommentId ? response.data : comment));
            setEditingCommentId(null);
            setEditingCommentContent('');
        } catch (error) {
            console.error('Error updating comment:', error);
            setError('Error al actualizar el comentario.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:3000/comments/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            setError('Error al eliminar el comentario.');
        }
    };

    return (
        <div className="comentarios-card-flex">
            <h2>Comentarios:</h2>
            {error && <p>{error}</p>}
            {comments.length === 0 ? (
                <p>No hay comentarios aún.</p>
            ) : (
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <div className="username-date">
                                <p className="username">@{comment.username}</p>
                                <p className="date">{new Date(comment.date).toLocaleDateString()}</p>
                            </div>
                            {editingCommentId === comment._id ? (
                                <form className="form-comments-edit" onSubmit={handleEditCommentSubmit}>
                                    <textarea
                                        value={editingCommentContent}
                                        onChange={handleEditCommentChange}
                                        required
                                    />
                                    <button type="submit">Guardar</button>
                                    <button type="button" onClick={() => setEditingCommentId(null)}>Cancelar</button>
                                </form>
                            ) : (
                                <>
                                    <p>{comment.content}</p>
                                    {user && user._id === comment.userId && (
                                        <div className="comments-buttons">
                                            <button onClick={() => {
                                                setEditingCommentId(comment._id);
                                                setEditingCommentContent(comment.content);
                                            }}>Editar</button>
                                            <button onClick={() => handleDeleteComment(comment._id)}>Eliminar</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {user && (
                <form className="form-comments" onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Escribe un comentario..."
                        required
                    />
                    <button type="submit">Enviar comentario</button>
                </form>
            )}
        </div>
    );
};

export default Comment;
    