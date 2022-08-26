import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serves images
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "API is running on /api" });
});

app.get("/blocks", async (req: Request, res: Response) => {
  const blocks = await prisma.block.findMany({
    include: {
      products: true,
    },
  });
  res.json(blocks);
});

app.get("/products", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post("/product", async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || !name) {
    res.json({ message: "no go" });
    res.statusCode = 500;
    return;
  }

  const result = await prisma.product
    .create({
      data: {
        id,
        name,
      },
    })
    .catch((err) => {
      res.json("error! Could not add your product");
      res.statusCode = 500;
      return;
    });

  const newlyAddedProduct = await prisma.product.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });

  res.json(newlyAddedProduct);
});

/* eslint-disable */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (err && err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      message: "missing authorization credentials",
    });
    // @ts-ignore
  } else if (err && err.errorCode) {
    // @ts-ignore
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
});

/**
 * Server activation
 */

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
