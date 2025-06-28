package com.kma.shop.utils.generatedata;

import com.github.javafaker.Faker;
import com.kma.shop.entity.RoleEntity;
import com.kma.shop.entity.UserEntity;
import com.kma.shop.exception.AppException;
import com.kma.shop.mapping.UserMapping;
import com.kma.shop.repo.RoleRepo;
import com.kma.shop.repo.UserRepo;
import com.kma.shop.service.impl.RoleService;
import com.kma.shop.service.interfaces.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GenerateUserData {
    UserRepo userRepo;
    Faker faker;
    RoleRepo roleRepo;
    UserMapping userMapping;
    Random random = new Random();

    // Vietnamese names for more realistic data
    private final List<String> vietnameseFirstNames = Arrays.asList(
        "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
        "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Mai", "Tô", "Trịnh"
    );
    
    private final List<String> vietnameseLastNames = Arrays.asList(
        "Văn", "Thị", "Hoàng", "Minh", "Thành", "Huy", "Dũng", "Tuấn", "Nam", "Hùng",
        "Phương", "Linh", "Hương", "Thảo", "Nga", "Mai", "Hà", "Lan", "Trang", "Hoa"
    );

    // Vietnamese cities and districts for realistic addresses
    private final List<String> vietnameseCities = Arrays.asList(
        "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế", "Nha Trang", 
        "Vũng Tàu", "Đà Lạt", "Hạ Long", "Quy Nhơn", "Buôn Ma Thuột", "Thái Nguyên", "Việt Trì"
    );

    public void generate() throws AppException {
        if(userRepo.count() < 2){
            Set<RoleEntity> roles = getUserRole();
            List<UserEntity> users = new ArrayList<>(150); // Increased to 150 users
            
            // Generate admin user first
            UserEntity adminUser = userMapping.buildUserBase(
                "admin@techshop.com", 
                "0901234567", 
                "Admin TechShop", 
                "admin123", 
                "123 Đường ABC, Quận 1, TP. Hồ Chí Minh", 
                "", 
                roles
            );
            users.add(adminUser);
            
            // Generate regular users
            for(int i = 0; i < 149; i++){
                UserEntity entity = userMapping.buildUserBase(
                    generateEmail(), 
                    generatePhone(),
                    generateVietnameseName(), 
                    generatePassword(), 
                    generateVietnameseAddress(), 
                    "", 
                    roles
                );
                users.add(entity);
            }
            userRepo.saveAll(users);
            System.out.println("✅ Generated " + users.size() + " users successfully");
        }
    }

    private Set<RoleEntity> getUserRole() throws AppException {
        return Set.of(Objects.requireNonNull(roleRepo.findByRoleName("USER").orElse(null)));
    }

    private String generateEmail(){
        String[] emailProviders = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"};
        String provider = emailProviders[random.nextInt(emailProviders.length)];
        String name = faker.name().username().toLowerCase().replaceAll("[^a-z0-9]", "");
        return name + random.nextInt(999) + "@" + provider;
    }

    private String generatePassword(){
        // More secure password generation
        String[] commonPasswords = {
            "password123", "123456789", "qwerty123", "abc123456", "password2024",
            "techshop123", "user123456", "mypassword", "secure123", "login2024"
        };
        return commonPasswords[random.nextInt(commonPasswords.length)];
    }

    private String generatePhone(){
        // Vietnamese phone number format: 03x, 05x, 07x, 08x, 09x
        String[] prefixes = {"03", "05", "07", "08", "09"};
        String prefix = prefixes[random.nextInt(prefixes.length)];
        StringBuilder phone = new StringBuilder(prefix);
        
        // Generate 8 more digits
        for(int i = 0; i < 8; i++){
            phone.append(random.nextInt(10));
        }
        return phone.toString();
    }

    private String generateVietnameseAddress(){
        String city = vietnameseCities.get(random.nextInt(vietnameseCities.size()));
        String district = generateDistrict(city);
        String street = generateStreet();
        String houseNumber = String.valueOf(random.nextInt(200) + 1);
        
        return houseNumber + " " + street + ", " + district + ", " + city;
    }

    private String generateDistrict(String city) {
        Map<String, List<String>> cityDistricts = Map.of(
            "Hà Nội", Arrays.asList("Ba Đình", "Hoàn Kiếm", "Hai Bà Trưng", "Đống Đa", "Tây Hồ", "Cầu Giấy", "Thanh Xuân", "Hoàng Mai"),
            "TP. Hồ Chí Minh", Arrays.asList("Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12"),
            "Đà Nẵng", Arrays.asList("Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ"),
            "Hải Phòng", Arrays.asList("Hồng Bàng", "Ngô Quyền", "Lê Chân", "Hải An", "Kiến An", "Đồ Sơn")
        );
        
        List<String> districts = cityDistricts.getOrDefault(city, Arrays.asList("Quận Trung Tâm"));
        return districts.get(random.nextInt(districts.size()));
    }

    private String generateStreet() {
        String[] streetTypes = {"Đường", "Phố", "Lê", "Nguyễn", "Trần", "Lý"};
        String[] streetNames = {
            "Nguyễn Huệ", "Lê Lợi", "Trần Hưng Đạo", "Lý Thường Kiệt", "Phan Chu Trinh", 
            "Điện Biên Phủ", "Cách Mạng Tháng 8", "3 Tháng 2", "Võ Văn Tần", "Pasteur",
            "Hai Bà Trưng", "Lê Duẩn", "Nguyễn Thị Minh Khai", "Võ Thị Sáu", "Trương Định"
        };
        
        String type = streetTypes[random.nextInt(streetTypes.length)];
        String name = streetNames[random.nextInt(streetNames.length)];
        return type + " " + name;
    }

    private String generateVietnameseName(){
        String firstName = vietnameseFirstNames.get(random.nextInt(vietnameseFirstNames.size()));
        String lastName = vietnameseLastNames.get(random.nextInt(vietnameseLastNames.size()));
        return firstName + " " + lastName;
    }
}
