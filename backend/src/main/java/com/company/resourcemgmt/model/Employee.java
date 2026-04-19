package com.company.resourcemgmt.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "employees")
public class Employee {

    @Id
    private String id;

    private String name;
    private String role;
    private String department;

    @Indexed(unique = true, sparse = true)
    private String email;

    private String phone;
    private String avatarInitials;
    private String avatarColor;

    private EmployeeStatus status = EmployeeStatus.ACTIVE;
    private List<EmployeeSkill> skills = new ArrayList<>();

    // ===== Constructor =====

    public Employee() {}

    public Employee(String id, String name, String role, String department,
                    String email, String phone, String avatarInitials,
                    String avatarColor, EmployeeStatus status, List<EmployeeSkill> skills) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.department = department;
        this.email = email;
        this.phone = phone;
        this.avatarInitials = avatarInitials;
        this.avatarColor = avatarColor;
        this.status = (status != null) ? status : EmployeeStatus.ACTIVE;
        this.skills = (skills != null) ? skills : new ArrayList<>();
    }

    // ===== Getters & Setters =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }

    public String getAvatarColor() { return avatarColor; }
    public void setAvatarColor(String avatarColor) { this.avatarColor = avatarColor; }

    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }

    public List<EmployeeSkill> getSkills() { return skills; }
    public void setSkills(List<EmployeeSkill> skills) { this.skills = skills; }

    // ===== Logic Methods =====

    public double getSkillScore() {
        if (skills == null || skills.isEmpty()) return 0.0;
        return skills.stream()
                .mapToInt(EmployeeSkill::getProficiency)
                .average()
                .orElse(0.0);
    }

    public void generateInitials() {
        if (name != null && (avatarInitials == null || avatarInitials.isBlank())) {
            String[] parts = name.trim().split("\\s+");
            avatarInitials = (parts.length >= 2)
                    ? ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
                    : name.substring(0, Math.min(2, name.length())).toUpperCase();
        }
    }

    // ===== Enum =====

    public enum EmployeeStatus {
        ACTIVE,
        INACTIVE,
        ON_LEAVE
    }
}