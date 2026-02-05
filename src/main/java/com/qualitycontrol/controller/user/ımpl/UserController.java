package com.qualitycontrol.controller.user.ımpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

	@PutMapping(path = "/update/{id}")
	@Override
	public User updateUser(@PathVariable(name = "id") Integer id, @RequestBody User u) {
		return userService.updateUser(id, u);
	}

	@DeleteMapping(path = "/delete/{id}")
	@Override
	public void deleteUser(@PathVariable(name = "id") Integer id) {
		userService.deleteUser(id);
	}

	@GetMapping(path = "/list")
	@Override
	public List<User> getUserList() {
		return userService.getUserList();
	}

}
