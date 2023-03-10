package org.severstal.mdwiki.repository;

import org.severstal.mdwiki.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Репозиторий для взаимодействия с сущностью Person
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Integer> {

    /**
     * Поиск по Логину пользователя
     * @param username логин пользоватлея
     * @return возвращает найденного пользователя
     */
    Optional<Person> findByUsername(String username);

    /**
     * Поиск по Email пользователя
     * @param email email пользователя
     * @return возвращает найденного пользователя
     */
    Optional<Person> findByEmail(String email);

    /**
     * Поиск по Логину или Email пользователя
     * @param username логин пользователя
     * @param email email пользователя
     * @return возвращает найденного пользователя
     */
    Optional<Person> findByUsernameOrEmail(String username, String email);
}
