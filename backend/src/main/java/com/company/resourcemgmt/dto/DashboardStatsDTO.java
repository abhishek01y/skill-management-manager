package com.company.resourcemgmt.dto;

import java.util.List;

public class DashboardStatsDTO {

    private long totalEmployees;
    private double avgSkillScore;
    private int totalDepartments;
    private int totalSkills;

    private List<String> departments;
    private List<TopSkillDTO> topSkills;
    private List<DeptBreakdownDTO> deptBreakdown;

    // ===== Constructor =====
    public DashboardStatsDTO() {}

    // ===== Getters & Setters =====

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public double getAvgSkillScore() { return avgSkillScore; }
    public void setAvgSkillScore(double avgSkillScore) { this.avgSkillScore = avgSkillScore; }

    public int getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(int totalDepartments) { this.totalDepartments = totalDepartments; }

    public int getTotalSkills() { return totalSkills; }
    public void setTotalSkills(int totalSkills) { this.totalSkills = totalSkills; }

    public List<String> getDepartments() { return departments; }
    public void setDepartments(List<String> departments) { this.departments = departments; }

    public List<TopSkillDTO> getTopSkills() { return topSkills; }
    public void setTopSkills(List<TopSkillDTO> topSkills) { this.topSkills = topSkills; }

    public List<DeptBreakdownDTO> getDeptBreakdown() { return deptBreakdown; }
    public void setDeptBreakdown(List<DeptBreakdownDTO> deptBreakdown) { this.deptBreakdown = deptBreakdown; }

    // ===== Inner Class 1 =====
    public static class TopSkillDTO {

        private String skill;
        private double avgProficiency;

        public TopSkillDTO() {}

        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public double getAvgProficiency() { return avgProficiency; }
        public void setAvgProficiency(double avgProficiency) { this.avgProficiency = avgProficiency; }
    }

    // ===== Inner Class 2 =====
    public static class DeptBreakdownDTO {

        private String department;
        private long employeeCount;
        private double avgScore;

        public DeptBreakdownDTO() {}

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public long getEmployeeCount() { return employeeCount; }
        public void setEmployeeCount(long employeeCount) { this.employeeCount = employeeCount; }

        public double getAvgScore() { return avgScore; }
        public void setAvgScore(double avgScore) { this.avgScore = avgScore; }
    }
}