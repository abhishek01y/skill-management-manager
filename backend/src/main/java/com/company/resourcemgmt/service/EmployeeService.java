package com.company.resourcemgmt.service;

import com.company.resourcemgmt.dto.*;
import com.company.resourcemgmt.model.*;
import com.company.resourcemgmt.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired 
    private EmployeeRepository employeeRepo;

    // ── Employee CRUD ─────────────────────────────────────────

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepo.findAll().stream()
                .map(EmployeeDTO::from)
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(String id) {
        return EmployeeDTO.from(findOrThrow(id));
    }

    public EmployeeDTO createEmployee(EmployeeRequest req) {

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            employeeRepo.findByEmailIgnoreCase(req.getEmail()).ifPresent(e -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists.");
            });
        }

        // ❌ builder removed → ✅ normal object
        Employee emp = new Employee();
        emp.setName(req.getName());
        emp.setRole(req.getRole());
        emp.setDepartment(req.getDepartment());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setAvatarColor(req.getAvatarColor() != null ? req.getAvatarColor() : "av-blue");
        emp.setStatus(parseStatus(req.getStatus()));

        emp.generateInitials();

        return EmployeeDTO.from(employeeRepo.save(emp));
    }

    public EmployeeDTO updateEmployee(String id, EmployeeRequest req) {
        Employee emp = findOrThrow(id);

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            employeeRepo.findByEmailIgnoreCase(req.getEmail()).ifPresent(o -> {
                if (!o.getId().equals(id))
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use.");
            });
        }

        emp.setName(req.getName());
        emp.setRole(req.getRole());
        emp.setDepartment(req.getDepartment());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());

        if (req.getAvatarColor() != null)
            emp.setAvatarColor(req.getAvatarColor());

        emp.setStatus(parseStatus(req.getStatus()));
        emp.generateInitials();

        return EmployeeDTO.from(employeeRepo.save(emp));
    }

    public void deleteEmployee(String id) {
        findOrThrow(id);
        employeeRepo.deleteById(id);
    }

    // ── Rankings ──────────────────────────────────────────────

    public List<EmployeeDTO> getRankedEmployees() {
        AtomicInteger rank = new AtomicInteger(1);

        return employeeRepo.findAll().stream()
                .sorted(Comparator.comparingDouble(Employee::getSkillScore).reversed())
                .map(e -> {
                    EmployeeDTO d = EmployeeDTO.from(e);
                    d.setRank(rank.getAndIncrement());
                    return d;
                })
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getTopNEmployees(int n) {
        return getRankedEmployees().stream().limit(n).collect(Collectors.toList());
    }

    // ── Skill Assignment ──────────────────────────────────────

    public EmployeeDTO assignSkill(String empId, SkillRequest req) {
        Employee emp = findOrThrow(empId);

        Optional<EmployeeSkill> existing = emp.getSkills().stream()
                .filter(s -> s.getSkillName().equalsIgnoreCase(req.getSkillName()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setProficiency(req.getProficiency());
            existing.get().setCategory(req.getCategory());
        } else {
            // ❌ builder removed
            EmployeeSkill skill = new EmployeeSkill();
            skill.setSkillName(req.getSkillName());
            skill.setCategory(req.getCategory());
            skill.setProficiency(req.getProficiency());

            emp.getSkills().add(skill);
        }

        return EmployeeDTO.from(employeeRepo.save(emp));
    }
    public DashboardStatsDTO getDashboardStats() {

    List<Employee> all = employeeRepo.findAll();

    DashboardStatsDTO dto = new DashboardStatsDTO();

    dto.setTotalEmployees(all.size());

    double avg = all.stream()
            .mapToDouble(Employee::getSkillScore)
            .average()
            .orElse(0);

    dto.setAvgSkillScore(Math.round(avg * 10.0) / 10.0);

    dto.setTotalDepartments(
            (int) all.stream()
                    .map(Employee::getDepartment)
                    .distinct()
                    .count()
    );

    dto.setTotalSkills(
            (int) all.stream()
                    .flatMap(e -> e.getSkills().stream())
                    .map(EmployeeSkill::getSkillName)
                    .distinct()
                    .count()
    );

    return dto;
}

    public EmployeeDTO removeSkill(String empId, String skillId) {
        Employee emp = findOrThrow(empId);

        boolean removed = emp.getSkills().removeIf(s -> s.getId().equals(skillId));

        if (!removed)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found.");

        return EmployeeDTO.from(employeeRepo.save(emp));
    }

    // ── Filters & Search ──────────────────────────────────────

    public List<EmployeeDTO> getByDepartment(String dept) {
        return employeeRepo.findByDepartmentIgnoreCase(dept)
                .stream().map(EmployeeDTO::from)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> search(String q) {
        return employeeRepo.searchByNameOrRole(q)
                .stream().map(EmployeeDTO::from)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getBySkill(String name) {
        return employeeRepo.findBySkillName(name)
                .stream().map(EmployeeDTO::from)
                .collect(Collectors.toList());
    }

    public List<EmployeeDTO> getByStatus(String status) {
        try {
            return employeeRepo.findByStatus(
                    Employee.EmployeeStatus.valueOf(status.toUpperCase()))
                    .stream().map(EmployeeDTO::from)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }
    }

    // ── Metadata ──────────────────────────────────────────────

    public List<String> getAllDepartments() {
        return employeeRepo.findAll().stream()
                .map(Employee::getDepartment)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getAllSkillNames() {
        return employeeRepo.findAll().stream()
                .flatMap(e -> e.getSkills().stream())
                .map(EmployeeSkill::getSkillName)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return employeeRepo.findAll().stream()
                .flatMap(e -> e.getSkills().stream())
                .map(EmployeeSkill::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────

    private Employee findOrThrow(String id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Employee not found: " + id));
    }

    private Employee.EmployeeStatus parseStatus(String s) {
        try {
            return s != null
                    ? Employee.EmployeeStatus.valueOf(s.toUpperCase())
                    : Employee.EmployeeStatus.ACTIVE;
        } catch (IllegalArgumentException e) {
            return Employee.EmployeeStatus.ACTIVE;
        }
    }
}