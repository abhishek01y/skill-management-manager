package com.company.resourcemgmt.dto;

import jakarta.validation.constraints.*;

public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Department is required")
    private String department;

    @Email(message = "Invalid email")
    private String email;

    private String phone;
    private String avatarColor;
    private String status;

    // ===== Constructor =====
    public EmployeeRequest() {}

    public EmployeeRequest(String name, String role, String department,
                           String email, String phone, String avatarColor, String status) {
        this.name = name;
        this.role = role;
        this.department = department;
        this.email = email;
        this.phone = phone;
        this.avatarColor = avatarColor;
        this.status = status;
    }

    // ===== Getters & Setters =====

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

    public String getAvatarColor() { return avatarColor; }
    public void setAvatarColor(String avatarColor) { this.avatarColor = avatarColor; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}