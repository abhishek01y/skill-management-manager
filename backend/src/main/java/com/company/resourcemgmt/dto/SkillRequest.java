package com.company.resourcemgmt.dto;

import jakarta.validation.constraints.*;

public class SkillRequest {

    @NotBlank(message = "Skill name required")
    private String skillName;

    @NotBlank(message = "Category required")
    private String category;

    @Min(1)
    @Max(100)
    private int proficiency;

    // ===== Constructors =====

    public SkillRequest() {}

    public SkillRequest(String skillName, String category, int proficiency) {
        this.skillName = skillName;
        this.category = category;
        this.proficiency = proficiency;
    }

    // ===== Getters & Setters =====

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getProficiency() { return proficiency; }
    public void setProficiency(int proficiency) { this.proficiency = proficiency; }
}