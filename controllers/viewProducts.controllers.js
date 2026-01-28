import ProductModel from "../models/product.model.js";

export const productsView = async (req, res) => {
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

    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("products", {
      products: [],
      error: "Error al cargar los productos",
    });
  }
};
