import { productsService } from "../services/products.service.js";

export const getAllProducts = async (req, res) => {
  try {
    let { limit = 8, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};

    if (query) {
      if (query === "available") filter.status = true;
      else if (query === "unavailable") filter.status = false;
      else if (query === "true" || query === "false")
        filter.status = query === "true";
      else filter.category = query;
    }

    const sortConfig = {};
    if (sort === "asc") sortConfig.price = 1;
    if (sort === "desc") sortConfig.price = -1;

    const result = await productsService.getProducts(filter, {
      limit,
      page,
      sort: sortConfig,
      lean: true,
    });

    const baseURL = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const prevLink = result.hasPrevPage
      ? `${baseURL}?page=${result.prevPage}&limit=${limit}`
      : null;

    const nextLink = result.hasNextPage
      ? `${baseURL}?page=${result.nextPage}&limit=${limit}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const producto = await productsService.getProductById(req.params.pid);
    res.json(producto);
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const nuevoProducto = await productsService.createProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    res.status(201).json({
      status: "success",
      message: "Producto creado exitosamente",
      payload: nuevoProducto,
    });
  } catch {
    res.status(400).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const resultado = await productsService.updateProduct(
      req.params.pid,
      req.body,
    );

    res.json({
      message: "Producto actualizado exitosamente",
      payload: resultado,
    });
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productsService.deleteProduct(req.params.pid);

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};
