const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports PDF, DOC, DOCX.'));
    }
}).single('projectFile'); // 'projectFile' is the field name in the form

exports.uploadMiddleware = upload;

exports.createProject = async (req, res) => {
    // req.file contains the file info
    // req.body contains text fields
    const { title, description } = req.body;
    const userId = req.user.id;
    const departmentId = req.user.department_id;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert Project
        const [projectResult] = await connection.query(
            'INSERT INTO projects (title, description, student_id, department_id) VALUES (?, ?, ?, ?)',
            [title, description, userId, departmentId]
        );
        const projectId = projectResult.insertId;

        // 2. Insert Version 1
        await connection.query(
            'INSERT INTO project_versions (project_id, version_number, file_path, change_description, is_current) VALUES (?, ?, ?, ?, ?)',
            [projectId, 1, req.file.path, 'Initial upload', true]
        );

        await connection.commit();

        res.status(201).json({ message: 'Project created successfully', projectId });
    } catch (error) {
        await connection.rollback();
        // Delete uploaded file if DB transaction failed
        if (req.file) {
            fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
        }
        res.status(500).json({ message: 'Server error creating project', error: error.message });
    } finally {
        connection.release();
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        // Fetch projects with their latest version info and user details
        const [projects] = await db.query(`
            SELECT p.*, pv.version_number, pv.file_path, pv.upload_date, u.username as student_name
            FROM projects p
            JOIN project_versions pv ON p.id = pv.project_id
            JOIN users u ON p.student_id = u.id
            WHERE pv.is_current = TRUE
            ORDER BY p.created_at DESC
        `);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
};

exports.getProjectDetails = async (req, res) => {
    const projectId = req.params.id;
    try {
        const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
        if (project.length === 0) return res.status(404).json({ message: 'Project not found' });

        const [versions] = await db.query('SELECT * FROM project_versions WHERE project_id = ? ORDER BY version_number DESC', [projectId]);

        res.json({ project: project[0], versions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching project details' });
    }
};

exports.uploadNewVersion = async (req, res) => {
    const projectId = req.params.id;
    const { change_description } = req.body;
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check ownership (optional, depending on business logic)
        // const [proj] = await connection.query('SELECT student_id FROM projects WHERE id = ?', [projectId]);
        // if (proj[0].student_id !== userId) return res.status(403).json({message: 'Not authorized'});

        // Get max version
        const [rows] = await connection.query('SELECT MAX(version_number) as max_ver FROM project_versions WHERE project_id = ?', [projectId]);
        const nextVersion = (rows[0].max_ver || 0) + 1;

        // Set old current to false
        await connection.query('UPDATE project_versions SET is_current = FALSE WHERE project_id = ?', [projectId]);

        // Insert new version
        await connection.query(
            'INSERT INTO project_versions (project_id, version_number, file_path, change_description, is_current) VALUES (?, ?, ?, ?, ?)',
            [projectId, nextVersion, req.file.path, change_description || 'New version', true]
        );

        await connection.commit();
        res.status(201).json({ message: 'New version uploaded', version: nextVersion });
    } catch (error) {
        await connection.rollback();
        fs.unlink(req.file.path, () => { });
        console.error(error);
        res.status(500).json({ message: 'Server error uploading version' });
    } finally {
        connection.release();
    }
};
