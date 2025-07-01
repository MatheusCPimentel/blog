import { Router } from "express";
import { PostController } from "../controllers/postController";
import {
  validateCreatePost,
  validateUpdatePost,
  validatePagination,
} from "../middleware/validation";

const router = Router();
const postController = new PostController();

router.post("/", validateCreatePost, postController.createPost);
router.get("/", validatePagination, postController.getPosts);
router.get("/:id", postController.getPostById);
router.get("/slug/:slug", postController.getPostBySlug);
router.put("/:id", validateUpdatePost, postController.updatePost);
router.delete("/:id", postController.deletePost);

export { router as postRoutes };
