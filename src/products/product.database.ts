import { v4 as random } from "uuid";
import { Product, Products, UnitProduct } from "./product.interface";
import fs from "fs";

let products: Products = loadProducts();

function loadProducts(): Products {
  try {
    const data = fs.readFileSync("./products.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error loading products:", error);
  }
  return {};
}

function saveProducts() {
  try {
    fs.writeFileSync("./products.json", JSON.stringify(products, null, 2), "utf-8");
    console.log("Products saved successfully!");
  } catch (error) {
    console.log("Error saving products:", error);
  }
}

export const findAll = async (): Promise<UnitProduct[]> => Object.values(products);

export const findOne = async (id: string): Promise<UnitProduct | null> => {
  return products[id] || null;
};

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
  let id = random();

  let product = await findOne(id);
  while (product) {
    id = random();
    product = await findOne(id);
  }

  products[id] = {
    id,
    ...productInfo,
  };

  saveProducts();

  return products[id];
};

export const update = async (id: string, updateValues: Product): Promise<object | null> => {
  const product = await findOne(id);

  if (!product) {
    return null;
  }

  products[id] = {
    id,
    ...updateValues,
  };

  saveProducts();

  return { updateProduct: products[id] }; // ✅ Ensures "updateProduct" key is included
};

export const remove = async (id: string): Promise<null | void> => {
  const product = await findOne(id);

  if (!product) {
    return null;
  }

  delete products[id];
  saveProducts();
};
