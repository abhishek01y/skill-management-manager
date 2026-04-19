package com.company.resourcemgmt.dto;

import com.company.resourcemgmt.model.Employee;
import com.company.resourcemgmt.model.EmployeeSkill;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeDTO {

    private String id;
    private String name;
    private String role;
    private String department;
    private String email;
    private String phone;
    private String avatarInitials;
    private String avatarColor;
    private String status;

    private double skillScore;
    private int rank;
    private List<SkillDTO> skills;

    // ===== Constructor =====
    public EmployeeDTO() {}

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getSkillScore() { return skillScore; }
    public void setSkillScore(double skillScore) { this.skillScore = skillScore; }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public List<SkillDTO> getSkills() { return skills; }
    public void setSkills(List<SkillDTO> skills) { this.skills = skills; }

    // ===== INNER CLASS =====

    public static class SkillDTO {

        private String id;
        private String skillName;
        private String category;
        private int proficiency;

        public SkillDTO() {}

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public int getProficiency() { return proficiency; }
        public void setProficiency(int proficiency) { this.proficiency = proficiency; }

        public static SkillDTO from(EmployeeSkill s) {
            SkillDTO dto = new SkillDTO();
            dto.setId(s.getId());
            dto.setSkillName(s.getSkillName());
            dto.setCategory(s.getCategory());
            dto.setProficiency(s.getProficiency());
            return dto;
        }
    }

    // ===== STATIC MAPPER =====

    public static EmployeeDTO from(Employee emp) {

        List<SkillDTO> skillList = (emp.getSkills() != null)
                ? emp.getSkills().stream()
                    .map(SkillDTO::from)
                    .collect(Collectors.toList())
                : new ArrayList<>();

        EmployeeDTO dto = new EmployeeDTO();

        dto.setId(emp.getId());
        dto.setName(emp.getName());
        dto.setRole(emp.getRole());
        dto.setDepartment(emp.getDepartment());
        dto.setEmail(emp.getEmail());
        dto.setPhone(emp.getPhone());
        dto.setAvatarInitials(emp.getAvatarInitials());
        dto.setAvatarColor(emp.getAvatarColor());
        dto.setStatus(emp.getStatus() != null ? emp.getStatus().name() : "ACTIVE");
        dto.setSkillScore(Math.round(emp.getSkillScore() * 10.0) / 10.0);
        dto.setSkills(skillList);

        return dto;
    }
}