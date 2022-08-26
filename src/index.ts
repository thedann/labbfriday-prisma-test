import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { Layout, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(express.json());

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

app.patch("/block/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productIds }: { productIds: string[] } = req.body;

  const productsToAdd = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  const idNumber = parseInt(id);
  const post = await prisma.block.update({
    where: { id: idNumber },
    data: {
      products: productsToAdd,
      layout: Layout.LIST,
    },
  });
});

app.get("/products", async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post("/product", async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || !name) {
    res.status(500).json({ message: "no go" });

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
      res.status(500).json("error! Could not add your product");
      return;
    });

  const newlyAddedProduct = await prisma.product.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });

  res.json(result);
});

app.delete("/product/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.product.delete({
    where: {
      id,
    },
  });
  res.json(user);
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
