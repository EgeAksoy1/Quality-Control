package com.qualitycontrol.service.user.ımpl;

import java.util.Optional;

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

	@Override
	public User updateUser(Integer id, User u) {
		Optional<User> optional = userRepository.findById(id);
		User updated = new User();
		if(optional.isPresent()) {
			updated = optional.get();
			updated.setUsername(u.getUsername());
			updated.setPassword(u.getPassword());
			updated.setRole(u.getRole());
			return userRepository.save(updated);
		}
		return null;
	}

}
