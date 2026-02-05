package com.qualitycontrol.service.user.ımpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.qualitycontrol.model.User;
import com.qualitycontrol.repo.UserRepository;
import com.qualitycontrol.service.user.IUserService;

@Service
public class UserService implements IUserService {

	@Autowired
	private UserRepository userRepository;
	
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

	@Override
	public void deleteUser(Integer id) {
		Optional<User> optional = userRepository.findById(id);;
		if(optional.isPresent()) {			
			userRepository.delete(optional.get());
		}
	}

	@Override
	public List<User> getUserList() {
		return userRepository.findAll();
	}

	@Override
	public User getUserLogin(User u) {
		List<User> controllerList = getUserList();
		for(User c: controllerList) {
			if(c.getUsername().equals(u.getUsername()) && c.getPassword().equals(u.getPassword())) {
				return c;
			}
		}
		return null;
	}

}
