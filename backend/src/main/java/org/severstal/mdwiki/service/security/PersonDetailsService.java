package org.severstal.mdwiki.service.security;

import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.repository.PersonRepository;
import org.severstal.mdwiki.security.PersonDetails;
import org.severstal.mdwiki.util.exception.ElementNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/**
 * Сервис с логикой загрузки данных пользователя
 */
@Service
public class PersonDetailsService implements UserDetailsService {

    /**
     * Репозиторий для взаимодействия с сущностью Person
     */
    private final PersonRepository personRepository;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param personRepository репозиторий для взаимодействия с сущностью Person
     */
    @Autowired
    public PersonDetailsService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    /**
     * Метод, отвечающий за загрузку данных пользователя
     * @param usernameOrEmail логин или эл. почта пользователя
     * @return объект PersonDetails с данными о пользователе
     * @throws ElementNotFoundException если пользователь не найден
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws ElementNotFoundException {
        Person person = personRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ElementNotFoundException("Пользователь не найден"));

        return new PersonDetails(person);
    }
}
