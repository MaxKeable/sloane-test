import express from "express";
import getStockImages from "./get-stock-images";
import postStockImages from "./post-stock-images";
import deleteStockImages from "./delete-stock-image";
import updateStockImages from "./update-stock-image";

const router = express.Router();

console.log("image route file")

router.use("/images", getStockImages);
router.use("/upload-image", postStockImages);
router.use("/delete", deleteStockImages);
router.use("/update", updateStockImages);

export default router; 