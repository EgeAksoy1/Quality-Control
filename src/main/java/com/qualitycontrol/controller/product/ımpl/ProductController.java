package com.qualitycontrol.controller.product.ımpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qualitycontrol.controller.product.IProductController;
import com.qualitycontrol.model.Product;
import com.qualitycontrol.service.product.IProductService;

@RestController
@RequestMapping("/rest/api/product")
public class ProductController implements IProductController{

	@Autowired
	IProductService productService;
	
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

}
