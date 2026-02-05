package com.qualitycontrol.service.product.ımpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qualitycontrol.model.Product;
import com.qualitycontrol.repo.ProductRepository;
import com.qualitycontrol.service.product.IProductService;

@Service
public class ProductService implements IProductService{

	@Autowired
	ProductRepository productRepository;
	
	@Override
	public Product saveProduct(Product p) {
		return productRepository.save(p);
	}

	@Override
	public List<Product> getProductList() {
		return productRepository.findAll();
	}

}
