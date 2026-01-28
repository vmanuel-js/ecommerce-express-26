import ProductModel from "../models/product.model.js";

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

    const result = await ProductModel.paginate(filter, {
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
    const producto = await ProductModel.findById(req.params.pid);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};

export const createProduct = async (req, res) => {
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

  if (
    !title ||
    !description ||
    !code ||
    price == null ||
    stock == null ||
    !category
  ) {
    return res.status(400).json({
      error:
        "Faltan campos por completar. Debe incluir: title, description, code, price, stock, category",
    });
  }

  try {
    const nuevoProducto = await ProductModel.create({
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails || [],
    });

    res.status(201).json({
      status: "success",
      payload: nuevoProducto,
    });
  } catch {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const resultado = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true },
    );
    if (!resultado)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(resultado);
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const eliminado = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!eliminado)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch {
    res.status(404).json({ error: "ID inválido" });
  }
};
