package com.qualitycontrol.service.user;


import com.qualitycontrol.model.User;

public interface IUserService {

	public User saveUser(User u);
	
	public User updateUser(Integer id, User u);
	
	public void deleteUser (Integer id);	
	
}
