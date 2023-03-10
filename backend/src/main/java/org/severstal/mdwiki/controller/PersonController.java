package org.severstal.mdwiki.controller;

import org.modelmapper.ModelMapper;
import org.severstal.mdwiki.dto.person.PersonNoteRequest;;
import org.severstal.mdwiki.dto.person.PersonResponse;
import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * REST контроллер для CRUD операций над сущностью Person
 */
@RestController
@RequestMapping("/people")
public class PersonController {

    /**
     * Сервис с логикой CRUD операций над сущностью Person
     */
    private final PersonService personService;

    /**
     * Маппер для конвертации сущностей
     */
    private final ModelMapper modelMapper;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param personService сервис с логикой CRUD операций над сущностью Person
     * @param modelMapper маппер для конвертации сущностей
     */
    @Autowired
    public PersonController(PersonService personService, ModelMapper modelMapper) {
        this.personService = personService;
        this.modelMapper = modelMapper;
    }

    /**
     * Метод, отвечающий за обновление заметки пользователя
     * @param id ID пользователя
     * @param personNoteRequest DTO сущности запроса с новой заметкой
     * @return DTO сущности Person для ответа с кодом 200
     */
    @PutMapping("/{id}/note")
    public ResponseEntity<PersonResponse> noteUpdate(@PathVariable(name = "id") int id,
                                                     @RequestBody @Valid PersonNoteRequest personNoteRequest) {
        Person updatedPerson = personService.noteUpdate(id, personNoteRequest.getText());

        PersonResponse response = modelMapper.map(updatedPerson, PersonResponse.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}