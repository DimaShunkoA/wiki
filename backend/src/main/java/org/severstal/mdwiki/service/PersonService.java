package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.repository.PersonRepository;
import org.severstal.mdwiki.util.exception.ElementNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Сервис с логикой CRUD операций над сущностью Person
 */
@Service
@Transactional(readOnly = true)
public class PersonService implements PersonCrudService {

    /**
     * Репозиторий для взаимодействия с сущностью Person
     */
    private final PersonRepository personRepository;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param personRepository репозиторий для взаимодействия с сущностью Person
     */
    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    /**
     * Метод, отвечающий за обновление заметки пользователя по его ID
     * @param id ID пользователя
     * @param note обновленная записка
     * @return обновленного пользователя
     * @throws ElementNotFoundException если пользователя с таким ID не существует
     */
    @Override
    @Transactional
    public Person noteUpdate(int id, String note) throws ElementNotFoundException {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ElementNotFoundException("Пользователь не найден"));
        person.setNote(note);

        personRepository.save(person);

        return person;
    }
}
