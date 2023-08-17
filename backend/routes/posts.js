import express from "express";
import { addPost, deletePost, getMaterialsByExperimentId, getPost, getPosts, updatePost } from "../controllers/post.js";
const router= express.Router()
 
router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", addPost)
router.delete("/:id", deletePost)
router.put("/:id", updatePost)
router.get("/:id/materials", getMaterialsByExperimentId);

export default router;