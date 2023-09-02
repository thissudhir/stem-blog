import { pool } from '../db.js';

export const getPosts = (req, res) => {
  const q = req.query.subject
    ? 'SELECT * FROM experiments WHERE subject = ?'
    : 'SELECT * FROM experiments';

  pool.query(q, [req.query.subject], (err, data) => {
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

  pool.query(q, [experimentId], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json('Internal server error');
    }

    // console.log('Fetched rows:', rows); // Debug line

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
      steps: [],
    };
  
    const seenSteps = new Set(); // Use a Set to track seen steps
    const materialMap = new Map(); // Use a Map to groupmaterials

    for (const row of rows) {
      if (row.material_name && row.material_quantity) {
        const materialKey = `${row.material_name}-${row.material_quantity}`;
        if (!materialMap.has(materialKey)) {
          materialMap.set(materialKey, {
            name: row.material_name,
            quantity: row.material_quantity,
          });
        }
      }
    
  
      if (row.step_number !== null && !seenSteps.has(row.step_number)) {
        // Check if the step_number has not been seen before
        seenSteps.add(row.step_number); // Add it to the Set
        experiment.steps.push({
          step_number: row.step_number,
          image: row.step_image,
          description: row.step_description
        });
      }
    }
    experiment.materials = Array.from(materialMap.values());
    return experiment;
  }
  
  
  
};


export const addPost = async (req, res) => {
  const {
    name,
    description,
    materials,
    safetyPrecautions, 
    steps,
    difficulty,
    subject,
    main_image,
  } = req.body;

  const q =
    'INSERT INTO experiments (name, description, difficulty, subject, main_image, safety_precautions) VALUES (?, ?, ?, ?, ?, ?)';

  pool.query(
    q,
    [name, description, difficulty, subject, main_image, safetyPrecautions], 
    async (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json('Internal server error');
      }

      const experimentId = result.insertId;

      try {
        await insertMaterialsAndSteps(experimentId, materials, steps); 

        return res.status(200).json('Post added successfully');
      } catch (error) {
        console.error('Error inserting materials and steps:', error);
        return res.status(500).json('Internal server error');
      }
    }
  );
};

async function insertMaterialsAndSteps(experimentId, materials, steps) {
  // Insert materials into the materials table
  for (const material of materials) {
    const materialQuery = 'INSERT INTO materials (experiment_id, name, quantity) VALUES (?, ?, ?)';
    await pool.query(materialQuery, [experimentId, material.name, material.quantity]);
  }

  // Insert steps into the steps table
  for (const step of steps) {
    const stepQuery = 'INSERT INTO steps (experiment_id, step_number, image, description) VALUES (?, ?, ?, ?)';
    await pool.query(stepQuery, [experimentId, step.stepNumber, step.imageSrc, step.description]);
  }
}


export const deletePost = (req, res) => {
  const postId = req.params.id;

  const q = 'DELETE FROM experiments WHERE id = ?';

  pool.query(q, [postId], (err, result) => {
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

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const {
    name,
    description,
    materials,
    safetyPrecautions,
    steps,
    difficulty,
    subject,
    main_image,
  } = req.body;

  const q =
    'UPDATE experiments SET `name` = ?, `description` = ?, `difficulty` = ?, `subject` = ?, `safety_precautions` = ?, `main_image` = ? WHERE id = ?';

  try {
    await pool.query(
      q,
      [name, description, difficulty, subject, safetyPrecautions, main_image, postId]
    );

    await updateMaterialsAndSteps(postId, materials, steps); 

    return res.status(200).json('Post updated successfully');
  } catch (err) {
    console.error('Error updating data:', err);
    return res.status(500).json('Internal server error');
  }
};

async function updateMaterialsAndSteps(experimentId, materials, steps) {
  // Delete existing materials and steps related to the experiment
  await pool.query('DELETE FROM materials WHERE experiment_id = ?', [experimentId]);
  await pool.query('DELETE FROM steps WHERE experiment_id = ?', [experimentId]);

  // Insert new materials and steps
  await insertMaterialsAndSteps(experimentId, materials, steps);
}



export const getMaterialsByExperimentId = (req, res) => {
    const experimentId = req.params.id;
    const q = "SELECT * FROM materials WHERE experiment_id = ?";

    pool.query(q, [experimentId], (err, data) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json('Internal server error');
        }
        return res.status(200).json(data);
    });
};


