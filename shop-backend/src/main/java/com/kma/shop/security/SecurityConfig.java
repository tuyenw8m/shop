package com.kma.shop.security;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {
    CustomJwtDecoder customJwtDecoder;
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.customJwtDecoder = customJwtDecoder;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        System.err.println("Secuity filterchain");
        httpSecurity
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults());

        httpSecurity
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/v3/api-docs/**").anonymous()
                        // --- Start: Các đường dẫn cho phép truy cập công khai (permitAll) ---
                        .requestMatchers(
                                // Các đường dẫn Swagger/OpenAPI
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/webjars/**",

                                // Các đường dẫn API công khai khác
                                "/auth/login",
                                "/auth/register",
                                "/authentication",
                                "/logoutt",
                                HttpMethod.GET.name(), "/branches",
                                HttpMethod.GET.name(), "/products",
                                HttpMethod.GET.name(), "/products/*",
                                HttpMethod.GET.name(), "/categories",
                                HttpMethod.GET.name(), "/categories/*",
                                HttpMethod.GET.name(), "/products/*/reviews",
                                HttpMethod.GET.name(), "/categories/v2",
                                HttpMethod.GET.name(), "/categories/v2/parent/*",
                                HttpMethod.GET.name(), "/categories/v2/child/*",
                                HttpMethod.GET.name(), "/products/v2",
                                HttpMethod.GET.name(), "/products/v2/*",
                                HttpMethod.GET.name(), "/coupons",
                                HttpMethod.GET.name(), "/products/v2/top/week",
                                HttpMethod.GET.name(), "/products/v2/top/week/v2",
                                HttpMethod.GET.name(), "/events",
                                HttpMethod.GET.name(), "/event/*"

                        ).permitAll()
                        // --- End: Các đường dẫn cho phép truy cập công khai (permitAll) ---

                        // --- Start: Các đường dẫn yêu cầu xác thực và quyền cụ thể ---
                        .requestMatchers(HttpMethod.PUT, "/branches/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/branches/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/branches").hasRole("ADMIN")

                        .requestMatchers("/users/me").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/products/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/disable/*").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/*").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/cart").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/cart/*").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/cart").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/cart/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/cart/count").hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/orders").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/orders/*").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/orders").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/orders/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/orders/*/cancel").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/orders/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/orders/count").hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/products/*/reviews").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/reviews/*").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/products/*/reviews").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/reviews/*").hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/products/v2/add").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/v2/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/v2/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/v2/disable/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/v2/enable/*").hasRole("ADMIN")

<<<<<<< HEAD
                                .requestMatchers(HttpMethod.POST,"/events").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/events/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/events/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET,"/dashboard/summary").hasRole("ADMIN")
=======
                        .requestMatchers(HttpMethod.POST, "/events").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/events/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/events/*").hasRole("ADMIN")
>>>>>>> 2fe38ddd65fb212ce751b6e1dd96bd8e3a919183

                        // Đảm bảo bất kỳ request nào khác đều phải được xác thực
                        .anyRequest().authenticated());
        // --- End: Các đường dẫn yêu cầu xác thực và quyền cụ thể ---

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthenticationConverter());
        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}