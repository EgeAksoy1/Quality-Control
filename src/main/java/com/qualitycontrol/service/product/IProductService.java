package com.qualitycontrol.service.product;

import java.util.List;

import com.qualitycontrol.model.Product;

public interface IProductService {

	public Product saveProduct(Product p);
	
	public List<Product> getProductList();
	
	public void deleteProduct(Integer id);
	
	public Product updateProduct(Integer id, Product p);
	
	public List<Product> getProductListByParam(String columnName, String value);
}
