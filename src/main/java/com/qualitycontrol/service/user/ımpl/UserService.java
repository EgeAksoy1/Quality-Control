package com.qualitycontrol.service.user.ımpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qualitycontrol.model.User;
import com.qualitycontrol.repo.UserRepository;
import com.qualitycontrol.service.user.IUserService;

@Service
public class UserService implements IUserService {

	@Autowired
	UserRepository userRepository;
	
	@Override
	public User saveUser(User u) {
		return userRepository.save(u);
	}

}
