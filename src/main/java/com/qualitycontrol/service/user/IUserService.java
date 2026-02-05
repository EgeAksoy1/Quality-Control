package com.qualitycontrol.service.user;


import java.util.List;

import com.qualitycontrol.model.User;

public interface IUserService {

	public User saveUser(User u);
	
	public User updateUser(Integer id, User u);
	
	public void deleteUser (Integer id);
	
	public List<User> getUserList();
	
	public User getUserLogin(User u);
}
