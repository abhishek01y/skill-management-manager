package com.company.resourcemgmt.repository;

import com.company.resourcemgmt.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {

    // Case-insensitive department filter
    List<Employee> findByDepartmentIgnoreCase(String department);

    // Filter by status
    List<Employee> findByStatus(Employee.EmployeeStatus status);

    // Search name or role (case-insensitive regex)
    @Query("{ '$or': [ { 'name': { '$regex': ?0, '$options': 'i' } }, { 'role': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Employee> searchByNameOrRole(String query);

    // Find by email
    Optional<Employee> findByEmailIgnoreCase(String email);

    // Find employees who have a specific skill (searching inside embedded array)
    @Query("{ 'skills.skillName': { '$regex': ?0, '$options': 'i' } }")
    List<Employee> findBySkillName(String skillName);

    // Find employees by department (for distinct departments we use service layer)
    @Query(value = "{}", fields = "{ 'department': 1 }")
    List<Employee> findAllDepartmentsRaw();
}
