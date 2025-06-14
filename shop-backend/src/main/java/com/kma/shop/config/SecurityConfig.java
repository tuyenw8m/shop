package com.kma.shop.config;

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
public class SecurityConfig  {
    CustomJwtDecoder customJwtDecoder;
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.customJwtDecoder = customJwtDecoder;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    //khi server khởi chạy, spring security sẽ tìm 1 Bean có kiểu là SecurityFilterChain trong ApplicationContext
    //nếu không tìm thấy Bean đó thì nó sẽ tự tạo với cấu hình mặc định
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        System.err.println("Secuity filterchain");
        httpSecurity
                .oauth2ResourceServer(oauth2->
                        oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder) //decode bằng custom decoder
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())) //use converter
                                .authenticationEntryPoint(jwtAuthenticationEntryPoint)) // config handle error when authentication
                .csrf(AbstractHttpConfigurer::disable)
                .cors(withDefaults());

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
                                .requestMatchers(HttpMethod.PUT,"/products/disable/*").hasRole("ADMIN")

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


                                .requestMatchers(HttpMethod.GET,"/categories/v2").permitAll()
                                .requestMatchers(HttpMethod.GET,"/categories/v2/parent/*").permitAll()
                                .requestMatchers(HttpMethod.GET,"/categories/v2/child/*").permitAll()




                                .requestMatchers(HttpMethod.GET, "/products/v2").permitAll()
                                .requestMatchers(HttpMethod.GET,"/products/v2/*").permitAll()
                                .requestMatchers(HttpMethod.POST,"/products/v2/add").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/products/v2/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE,"/products/v2/*").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT,"/products/v2/disable/*").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.GET,"/coupons").permitAll()
//                                .requestMatchers(HttpMethod.POST,"/products/*/reviews").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.POST,"/reviews/apply").hasRole("USER")

                                .anyRequest().authenticated());
        return httpSecurity.build();
    }


    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthenticationConverter());
        return jwtAuthenticationConverter;
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
