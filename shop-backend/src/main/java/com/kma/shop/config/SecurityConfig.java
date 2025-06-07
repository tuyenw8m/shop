package com.kma.shop.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig  {
    @Value("${jwt.signerKey}")
    private String SIGNED_KEY;
    @Autowired
    private CustomJwtDecoder customJwtDecoder;
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .oauth2ResourceServer(oauth2->
                        oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                                .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults())
        ;
        httpSecurity
                .authorizeHttpRequests(request ->
                        request
                                .requestMatchers("/auth/login").permitAll()
                                .requestMatchers("/auth/register").permitAll()
                                .requestMatchers("/users/me").hasRole("USER")
                                .requestMatchers("/authentication").permitAll()
                                .requestMatchers("/logoutt").permitAll()
                                .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET, "/products").permitAll()
                                .requestMatchers(HttpMethod.GET,"/products/*").permitAll()
                                .requestMatchers(HttpMethod.POST,"/products/add").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/products/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/products/*").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET,"/categories").permitAll()
                                .requestMatchers(HttpMethod.GET,"/categories/*").permitAll()
                                .requestMatchers(HttpMethod.POST,"/categories").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/categories/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/categories/*").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET,"/cart").hasRole("USER")
                                .requestMatchers(HttpMethod.PUT,"/cart/*").hasRole("USER")
                                .requestMatchers(HttpMethod.POST,"/cart").hasRole("USER")
                                .requestMatchers(HttpMethod.DELETE,"/cart/*").hasRole("USER")

                                .requestMatchers(HttpMethod.GET,"/orders").hasRole("USER")
                                .requestMatchers(HttpMethod.GET,"/orders/*").hasRole("USER")
                                .requestMatchers(HttpMethod.POST,"/orders").hasRole("USER")
                                .requestMatchers(HttpMethod.PUT,"/orders/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/orders/*").hasRole("USER")

                                .requestMatchers(HttpMethod.GET,"/products/*/reviews").permitAll()
                                .requestMatchers(HttpMethod.POST,"/products/*/reviews").hasRole("USER")
                                .requestMatchers(HttpMethod.DELETE,"/reviews/*").hasRole("USER")
                                .requestMatchers(HttpMethod.PUT,"/products/*/reviews").hasRole("USER")
                                .requestMatchers(HttpMethod.PUT,"/reviews/*").hasRole("USER")


                                .requestMatchers(HttpMethod.GET,"/coupons").permitAll()
                                .requestMatchers(HttpMethod.POST,"/products/*/reviews").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.POST,"/reviews/apply").hasRole("USER")

                                .anyRequest().authenticated());
        return httpSecurity.build();
    }


    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthenticationConverter());
        return jwtAuthenticationConverter;
    }

    @Bean
    JwtDecoder jwtDecoder(){
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNED_KEY.getBytes(), "HmacSHA512");
        NimbusJwtDecoder nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
        nimbusJwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer("hoangtuyen.com"));
        return nimbusJwtDecoder;
    }
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
