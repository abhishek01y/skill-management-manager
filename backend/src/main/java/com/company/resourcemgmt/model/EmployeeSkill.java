package com.company.resourcemgmt.model;

import java.util.UUID;

public class EmployeeSkill {

    private String id;
    private String skillName;
    private String category;
    private int proficiency; // 1–100

    // ===== Constructors =====

    public EmployeeSkill() {
        this.id = UUID.randomUUID().toString();
    }

    public EmployeeSkill(String id, String skillName, String category, int proficiency) {
        this.id = (id != null) ? id : UUID.randomUUID().toString();
        this.skillName = skillName;
        this.category = category;
        this.proficiency = proficiency;
    }

    // ===== Getters & Setters =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getProficiency() { return proficiency; }
    public void setProficiency(int proficiency) { this.proficiency = proficiency; }
}