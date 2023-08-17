import { db } from '../db.js';

export const getPosts = (req, res) => {
  const q = req.query.subject
    ? 'SELECT * FROM experiments WHERE subject = ?'
    : 'SELECT * FROM experiments';

  db.query(q, [req.query.subject], (err, data) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json('Internal server error');
    }

    res.json(data);
  });
};

export const getPost = (req, res) => {
  const experimentId = req.params.id;

  const q = `
    SELECT
    e.id,
    e.name,
    e.description,
    e.difficulty,
    e.subject,
    e.main_image,
    e.safety_precautions,
    m.name AS material_name,
    m.quantity AS material_quantity,
    s.step_number,
    s.image AS step_image,
    s.description AS step_description
  FROM experiments AS e
  LEFT JOIN materials AS m ON e.id = m.experiment_id
  LEFT JOIN steps AS s ON e.id = s.experiment_id
  WHERE e.id = ?;

  `;

  db.query(q, [experimentId], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json('Internal server error');
    }

    console.log('Fetched rows:', rows); // Debug line

    const experiment = processRows(rows);
    res.status(200).json(experiment);
  });
  function processRows(rows) {
    const experiment = {
      id: rows[0].id,
      name: rows[0].name,
      description: rows[0].description,
      difficulty: rows[0].difficulty,
      subject: rows[0].subject,
      main_image: rows[0].main_image,
      safety_precautions: rows[0].safety_precautions,
      materials: [],
      steps: []
    };
  
    for (const row of rows) {
      if (row.material_name && row.material_quantity) {
        experiment.materials.push({
          name: row.material_name,
          quantity: row.material_quantity
        });
      }
  
      if (row.step_number !== null && row.step_image && row.step_description) {
        experiment.steps.push({
          step_number: row.step_number,
          image: row.step_image,
          description: row.step_description
        });
      }
    }
  
    return experiment;
  }
  
  
};


// Import necessary modules and dependencies

// ... (your other imports)

// ... (other imports)

// ... (other imports)

export const addPost = async (req, res) => {
  const {
    name,
    description,
    materials,
    safetyPrecautions, // Updated variable name
    steps,
    difficulty,
    subject,
    main_image,
  } = req.body;

  const q =
    'INSERT INTO experiments (name, description, difficulty, subject, main_image, safety_precautions) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(
    q,
    [name, description, difficulty, subject, main_image, safetyPrecautions], // Corrected field name
    async (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json('Internal server error');
      }

      const experimentId = result.insertId;

      try {
        await insertMaterialsAndSteps(experimentId, materials, steps); // Added try-catch block here

        return res.status(200).json('Post added successfully');
      } catch (error) {
        console.error('Error inserting materials and steps:', error);
        return res.status(500).json('Internal server error');
      }
    }
  );
};

// ... (rest of the code)

// ... (rest of the code)


async function insertMaterialsAndSteps(experimentId, materials, steps) {
  // Insert materials into the materials table
  for (const material of materials) {
    const materialQuery = 'INSERT INTO materials (experiment_id, name, quantity) VALUES (?, ?, ?)';
    await db.query(materialQuery, [experimentId, material.name, material.quantity]);
  }

  // Insert steps into the steps table
  for (const step of steps) {
    const stepQuery = 'INSERT INTO steps (experiment_id, step_number, image, description) VALUES (?, ?, ?, ?)';
    await db.query(stepQuery, [experimentId, step.stepNumber, step.imageSrc, step.description]);
  }
}


export const deletePost = (req, res) => {
  const postId = req.params.id;

  const q = 'DELETE FROM experiments WHERE id = ?';

  db.query(q, [postId], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json('Internal server error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json('Post not found');
    }

    return res.status(200).json('Post deleted successfully');
  });
};

export const updatePost = (req, res) => {
  const postId = req.params.id;
  const {
    name,
    description,
    materials,
    safetyPrecautions, // Updated variable name
    steps,
    difficulty,
    subject,
    main_image,
  } = req.body;

  const q =
    'UPDATE experiments SET `name` = ?, `description `= ?, `difficulty` = ?, `subject` = ?,` materials` =?, `safetyPrecautions` = ?,`steps` = ?, `main_image` = ? WHERE id = ?';

  db.query(
    q,
    [name, description, difficulty, subject, steps, materials, safetyPrecautions, main_image, postId],
    (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        return res.status(500).json('Internal server error');
      }

      if (result.affectedRows === 0) {
        return res.status(404).json('Post not found');
      }

      return res.status(200).json('Post updated successfully');
    }
  );
};

export const getMaterialsByExperimentId = (req, res) => {
    const experimentId = req.params.id;
    const q = "SELECT * FROM materials WHERE experiment_id = ?";

    db.query(q, [experimentId], (err, data) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json('Internal server error');
        }
        return res.status(200).json(data);
    });
};


