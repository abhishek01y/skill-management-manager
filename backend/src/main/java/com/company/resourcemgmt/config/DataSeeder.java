package com.company.resourcemgmt.config;

import com.company.resourcemgmt.model.Employee;
import com.company.resourcemgmt.model.EmployeeSkill;
import com.company.resourcemgmt.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Override
    public void run(String... args) {

        if (employeeRepo.count() > 0) {
            System.out.println("[DataSeeder] MongoDB already has data — skipping seed.");
            return;
        }

        System.out.println("[DataSeeder] Seeding 8 employees...");

        List<Employee> employees = List.of(
                build("Anjali Sharma", "Senior Developer", "Engineering", "anjali@company.com", "+91 98100 11111", "AS", "av-blue",
                        sk("Java","Backend",92), sk("Spring Boot","Backend",85), sk("SQL","Data",78), sk("Docker","DevOps",65)),

                build("Rohan Mehta", "Frontend Lead", "Engineering", "rohan@company.com", "+91 98100 22222", "RM", "av-teal",
                        sk("React","Frontend",95), sk("TypeScript","Frontend",88), sk("Node.js","Backend",72), sk("Figma","Design",60))
        );

        employeeRepo.saveAll(employees);
        System.out.println("[DataSeeder] Done.");
    }

    // ❌ builder removed → ✅ normal object
    private Employee build(String name, String role, String dept, String email, String phone,
                           String ini, String color, EmployeeSkill... skills) {

        Employee emp = new Employee();

        emp.setName(name);
        emp.setRole(role);
        emp.setDepartment(dept);
        emp.setEmail(email);
        emp.setPhone(phone);
        emp.setAvatarInitials(ini);
        emp.setAvatarColor(color);
        emp.setStatus(Employee.EmployeeStatus.ACTIVE);

        for (EmployeeSkill s : skills) {
            emp.getSkills().add(s);
        }

        return emp;
    }

    // ❌ builder removed
    private EmployeeSkill sk(String name, String cat, int pct) {
        EmployeeSkill s = new EmployeeSkill();
        s.setSkillName(name);
        s.setCategory(cat);
        s.setProficiency(pct);
        return s;
    }
}