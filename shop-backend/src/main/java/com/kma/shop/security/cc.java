//package com.kma.shop.security;
//
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//@Component
//public class LoginLogoutFilter extends OncePerRequestFilter {
//
//    private final AuthenticationManager authenticationManager;
//    private final JwtService jwtService;
//    private final UserDetailsService userDetailsService;
//
//    public LoginLogoutFilter(AuthenticationManager authenticationManager,
//                             JwtService jwtService,
//                             UserDetailsService userDetailsService) {
//        this.authenticationManager = authenticationManager;
//        this.jwtService = jwtService;
//        this.userDetailsService = userDetailsService;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String path = request.getServletPath();
//        String method = request.getMethod();
//
//        if ("/api/auth/login".equals(path) && "POST".equalsIgnoreCase(method)) {
//            handleLogin(request, response);
//            return;
//        }
//
//        if ("/api/auth/logout".equals(path) && "POST".equalsIgnoreCase(method)) {
//            handleLogout(request, response);
//            return;
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        try {
//            LoginRequest loginRequest = new ObjectMapper().readValue(request.getInputStream(), LoginRequest.class);
//
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
//            );
//
//            UserDetails user = (UserDetails) authentication.getPrincipal();
//            String token = jwtService.generateToken(user);
//
//            response.setContentType("application/json");
//            response.getWriter().write(new ObjectMapper().writeValueAsString(Map.of("token", token)));
//            response.setStatus(HttpServletResponse.SC_OK);
//
//        } catch (AuthenticationException e) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Invalid credentials");
//        }
//    }
//
//    private void handleLogout(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        // Với JWT: thường không có gì để làm (vì không có session)
//        // Option: đưa token vào blacklist (nếu có hệ thống lưu)
//        response.setStatus(HttpServletResponse.SC_OK);
//        response.getWriter().write("Logged out (if stateless, nothing to invalidate)");
//    }
//}
