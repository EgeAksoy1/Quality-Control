package com.qualitycontrol.controller.user.ımpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qualitycontrol.controller.user.IUserController;
import com.qualitycontrol.model.User;
import com.qualitycontrol.service.user.IUserService;


@RestController
@RequestMapping("/rest/api/user")
public class UserController implements IUserController{

	@Autowired
	IUserService userService;
	
	@PostMapping(path = "/save")
	@Override
	public User saveUser(@RequestBody User u) {
		return userService.saveUser(u);
	}

}
