const db = require('../config/db');

// --- Reading Progress ---

exports.saveProgress = async (req, res) => {
    const { projectId, versionId, lastPage } = req.body;
    const userId = req.user.id;

    try {
        // Upsert logic for compatibility (Insert or Update)
        const [existing] = await db.query(
            'SELECT id FROM user_reading_progress WHERE user_id = ? AND project_id = ? AND version_id = ?',
            [userId, projectId, versionId]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE user_reading_progress SET last_page = ? WHERE id = ?',
                [lastPage, existing[0].id]
            );
        } else {
            await db.query(
                'INSERT INTO user_reading_progress (user_id, project_id, version_id, last_page) VALUES (?, ?, ?, ?)',
                [userId, projectId, versionId, lastPage]
            );
        }

        res.json({ message: 'Progress saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving progress' });
    }
};

exports.getProgress = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            'SELECT last_page, version_id FROM user_reading_progress WHERE user_id = ? AND project_id = ? ORDER BY updated_at DESC LIMIT 1',
            [userId, projectId]
        );

        if (rows.length === 0) {
            return res.json({ lastPage: 1 });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching progress' });
    }
};

// --- Annotations ---

exports.getAnnotations = async (req, res) => {
    const { versionId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT a.*, u.username 
             FROM annotations a 
             JOIN users u ON a.user_id = u.id 
             WHERE a.version_id = ? 
             ORDER BY a.created_at ASC`,
            [versionId]
        );

        // Parse position_data if it's a string
        const annotations = rows.map(ann => ({
            ...ann,
            position_data: typeof ann.position_data === 'string' ? JSON.parse(ann.position_data) : ann.position_data
        }));

        res.json(annotations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching annotations' });
    }
};

exports.createAnnotation = async (req, res) => {
    const { versionId, pageNumber, color, type, positionData, content } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await db.query(
            'INSERT INTO annotations (user_id, version_id, page_number, color, type, position_data, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, versionId, pageNumber, color, type || 'highlight', JSON.stringify(positionData), content]
        );
        res.status(201).json({ id: result.insertId, message: 'Annotation created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating annotation' });
    }
};

exports.deleteAnnotation = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Only allow owner to delete? For now, yes.
        const [result] = await db.query('DELETE FROM annotations WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Annotation not found or unauthorized' });
        res.json({ message: 'Annotation deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting annotation' });
    }
};

// --- Comments ---

exports.addComment = async (req, res) => {
    const { annotationId, commentText } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await db.query(
            'INSERT INTO annotation_comments (annotation_id, user_id, comment_text) VALUES (?, ?, ?)',
            [annotationId, userId, commentText]
        );
        res.status(201).json({ id: result.insertId, message: 'Comment added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding comment' });
    }
};

exports.getComments = async (req, res) => {
    const { annotationId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT ac.*, u.username 
             FROM annotation_comments ac 
             JOIN users u ON ac.user_id = u.id 
             WHERE ac.annotation_id = ? 
             ORDER BY ac.created_at ASC`,
            [annotationId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};
