package com.qualitycontrol.controller.product.ımpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qualitycontrol.controller.product.IProductController;
import com.qualitycontrol.model.Product;
import com.qualitycontrol.service.product.IProductService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/rest/api/product")
public class ProductController implements IProductController{

	@Autowired
	private IProductService productService;
	
	@PostMapping(path = "/save")
	@Override
	public Product saveProduct(@RequestBody Product p) {

		return productService.saveProduct(p);
	}

	@GetMapping(path = "/list")
	@Override
	public List<Product> getProductList() {
		return productService.getProductList();
	}

	@DeleteMapping(path = "/delete/{id}")
	@Override
	public void deleteProduct(@PathVariable(name = "id") Integer id) {
		productService.deleteProduct(id);
	}

	@PutMapping(path = "/update/{id}")
	@Override
	public Product updateProduct(@PathVariable(name = "id") Integer id, @RequestBody Product p) {
		return productService.updateProduct(id, p);
	}

	@GetMapping(path = "/search/{columnName}/{value}")
	@Override
	public List<Product> getProductListByParam(@PathVariable(name = "columnName") String columnName, @PathVariable(name = "value") String value) {
		return productService.getProductListByParam(columnName, value);
	}

}
