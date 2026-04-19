package com.company.resourcemgmt.controller;

import com.company.resourcemgmt.dto.*;
import com.company.resourcemgmt.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResourceController {

    @Autowired
    private EmployeeService employeeService;

    // ── CRUD ─────────────────────────────────────────

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDTO> getOne(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping("/employees")
    public ResponseEntity<EmployeeDTO> create(@Valid @RequestBody EmployeeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(req));
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable String id,
                                              @Valid @RequestBody EmployeeRequest req) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, req));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // ── Rankings ─────────────────────────────────────

    @GetMapping("/employees/ranked")
    public ResponseEntity<List<EmployeeDTO>> getRanked() {
        return ResponseEntity.ok(employeeService.getRankedEmployees());
    }

    @GetMapping("/employees/top")
    public ResponseEntity<List<EmployeeDTO>> getTop(@RequestParam(defaultValue = "5") int n) {
        return ResponseEntity.ok(employeeService.getTopNEmployees(n));
    }

    // ── Skills ───────────────────────────────────────

    @PostMapping("/employees/{id}/skills")
    public ResponseEntity<EmployeeDTO> assignSkill(@PathVariable String id,
                                                   @Valid @RequestBody SkillRequest req) {
        return ResponseEntity.ok(employeeService.assignSkill(id, req));
    }

    @DeleteMapping("/employees/{empId}/skills/{skillId}")
    public ResponseEntity<EmployeeDTO> removeSkill(@PathVariable String empId,
                                                   @PathVariable String skillId) {
        return ResponseEntity.ok(employeeService.removeSkill(empId, skillId));
    }

    // ── Filters ──────────────────────────────────────

    @GetMapping("/employees/department/{dept}")
    public ResponseEntity<List<EmployeeDTO>> getByDept(@PathVariable String dept) {
        return ResponseEntity.ok(employeeService.getByDepartment(dept));
    }

    @GetMapping("/employees/search")
    public ResponseEntity<List<EmployeeDTO>> search(@RequestParam String q) {
        return ResponseEntity.ok(employeeService.search(q));
    }

    @GetMapping("/employees/by-skill")
    public ResponseEntity<List<EmployeeDTO>> getBySkill(@RequestParam String name) {
        return ResponseEntity.ok(employeeService.getBySkill(name));
    }

    @GetMapping("/employees/by-status")
    public ResponseEntity<List<EmployeeDTO>> getByStatus(@RequestParam String status) {
        return ResponseEntity.ok(employeeService.getByStatus(status));
    }

    // ── Metadata ─────────────────────────────────────

    @GetMapping("/meta/departments")
    public ResponseEntity<List<String>> getDepts() {
        return ResponseEntity.ok(employeeService.getAllDepartments());
    }

    @GetMapping("/meta/skills")
    public ResponseEntity<List<String>> getSkills() {
        return ResponseEntity.ok(employeeService.getAllSkillNames());
    }

    @GetMapping("/meta/categories")
    public ResponseEntity<List<String>> getCats() {
        return ResponseEntity.ok(employeeService.getAllCategories());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> dash() {
        return ResponseEntity.ok(employeeService.getDashboardStats());
    }
}