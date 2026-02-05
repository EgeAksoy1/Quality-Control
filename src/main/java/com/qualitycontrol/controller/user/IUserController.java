package com.qualitycontrol.controller.user;


import java.util.List;

import com.qualitycontrol.model.User;

public interface IUserController {

	public User saveUser(User u);
	
	public User updateUser(Integer id, User u);
	
	public void deleteUser(Integer id);
	
	public List<User> getUserList();
	
	public User getUserLogin(String username, String password);
}
