package com.qualitycontrol.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.qualitycontrol.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	
	@Query(value = "SELECT * FROM qualitycontrol.product WHERE " +
		       "(:columnName = 'id' AND CAST(id AS text) = :value) OR " +
		       "(:columnName = 'product_name' AND product_name = :value) OR " +
		       "(:columnName = 'bag_no' AND CAST(bag_no AS text) = :value) OR " +
		       "(:columnName = 'brut_kg' AND CAST(brut_kg AS text) = :value) OR " + 
		       "(:columnName = 'colour_b' AND CAST(colour_b AS text) = :value) OR " +
		       "(:columnName = 'colour_l' AND CAST(colour_l AS text) = :value) OR " +
		       "(:columnName = 'lot_no' AND lot_no = :value) OR " +
		       "(:columnName = 'net_kg' AND CAST(net_kg AS text) = :value) OR " +
		       "(:columnName = 'product_date' AND CAST(product_date AS text) = :value)", 
		       nativeQuery = true)
	List<Product> listColumnandValue(@Param("columnName") String columnName, @Param("value") String value);
}
