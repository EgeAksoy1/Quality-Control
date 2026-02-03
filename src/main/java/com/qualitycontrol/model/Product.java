package com.qualitycontrol.model;

import java.sql.Date;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "product_name", nullable = false)
	private String productName;
	
	@Column(name = "lot_no", nullable = false)
	private String lotNo;
	
	@Column(name = "bag_no", nullable = false)
	private Integer bagNo;
	
	@Column(name = "brut_kg", nullable = false)
	private Double brutKg;
	
	@Column(name = "net_kg", nullable = false)
	private Double netKg;
	
	@Column(name = "colour_L", nullable = true)
	private Double colourL;
	
	@Column(name = "colour_B", nullable = true)
	private Double colourB;
	
	@DateTimeFormat(iso = ISO.DATE)
	@Column(name = "product_date", nullable = true)
	private Date productDate;
}
