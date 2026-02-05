package com.qualitycontrol.controller.product;

import java.util.List;

import com.qualitycontrol.model.Product;

public interface IProductController {

	public Product saveProduct(Product p);
	
	public List<Product> getProductList();
	
	public void deleteProduct(Integer id);
	
	public Product updateProduct(Integer id, Product p);
}
