package donation.main.security;

import jakarta.persistence.EntityNotFoundException;
import donation.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String credentials) throws UsernameNotFoundException {
        return userRepository.findByUsername(credentials)
                .orElseGet(() -> userRepository.findByEmail(credentials).orElseThrow(() ->
                        new EntityNotFoundException("Can't find user by credentials: " + credentials)));
    }
}
