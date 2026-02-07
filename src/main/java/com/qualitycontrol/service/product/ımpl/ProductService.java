package com.qualitycontrol.service.product.ımpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qualitycontrol.model.Product;
import com.qualitycontrol.repo.ProductRepository;
import com.qualitycontrol.service.product.IProductService;

@Service
public class ProductService implements IProductService{

	@Autowired
	private ProductRepository productRepository;
	
	@Override
	public Product saveProduct(Product p) {
		return productRepository.save(p);
	}

	@Override
	public List<Product> getProductList() {
		return productRepository.findAll();
	}

	@Override
	public void deleteProduct(Integer id) {
		Optional<Product> optional = productRepository.findById(id);
		if(optional.isPresent()) {
			productRepository.delete(optional.get());
		}
	}

	@Override
	public Product updateProduct(Integer id, Product p) {
		Optional<Product> optional = productRepository.findById(id);
		Product updated = new Product();
		if(optional.isPresent()) {
			updated = optional.get();
			BeanUtils.copyProperties(p, updated);
			updated.setId(id);
			return productRepository.save(updated);
		}
		return null;
	}

	@Override
	public List<Product> getProductListByParam(String columnName, String value) {
		return productRepository.listColumnandValue(columnName, value);
	}

}
