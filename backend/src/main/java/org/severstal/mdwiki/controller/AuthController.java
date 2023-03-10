package org.severstal.mdwiki.controller;

import org.modelmapper.ModelMapper;
import org.severstal.mdwiki.dto.error.ErrorResponse;
import org.severstal.mdwiki.dto.person.PersonLogin;
import org.severstal.mdwiki.dto.person.PersonRegistration;
import org.severstal.mdwiki.dto.person.PersonResponse;
import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.service.security.EntryService;
import org.severstal.mdwiki.util.ResourceFetcher;
import org.severstal.mdwiki.util.exception.RegistrationFailedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Контроллер для страниц login и registration
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    /**
     * Сервис с логикой входа и регистрации пользователя
     */
    private final EntryService entryService;

    /**
     * Компонент для получения ресурсов
     */
    private final ResourceFetcher resourceFetcher;

    /**
     * Маппер для конвертации сущностей
     */
    private final ModelMapper modelMapper;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param entryService сервис с логикой входа и регистрации пользователя
     * @param resourceFetcher компонент для получения ресурсов
     * @param modelMapper маппер для конвертации сущностей
     */
    @Autowired
    public AuthController(EntryService entryService, ResourceFetcher resourceFetcher, ModelMapper modelMapper) {
        this.entryService = entryService;
        this.resourceFetcher = resourceFetcher;
        this.modelMapper = modelMapper;
    }

    /**
     * Метод для авторизации пользователя
     * @param personLogin DTO сущности Person для логина
     * @return если пользователь успешно авторизирован статус 200, в противном случае 403
     */
    @PostMapping("/login")
    public ResponseEntity<HttpStatus> performLogin(@RequestBody @Valid PersonLogin personLogin) {
        entryService.login(personLogin);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Метод для получения авторизированного пользователя
     * @return авторизированного пользователя
     */
    @GetMapping("/whoami")
    public ResponseEntity<PersonResponse> whoAmI() {
        Person person = resourceFetcher.getLoggedInUser();

        PersonResponse response = modelMapper.map(person, PersonResponse.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Метод, отвечающий за регистрацию нового пользователя
     * @param personRegistration DTO сущности Person для регистрации
     * @return DTO сущности Person для ответа с кодом 201
     */
    @PostMapping("/registration")
    public ResponseEntity<Object> performRegistration(@RequestBody @Valid PersonRegistration personRegistration) {
        Person person = modelMapper.map(personRegistration, Person.class);

        Person registeredPerson = entryService.register(person);

        PersonResponse response = modelMapper.map(registeredPerson, PersonResponse.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Метод, отвечающий за выход пользователя
     */
    @PostMapping("/logout")
    public void logout() {
        entryService.logout();
    }

    @ExceptionHandler(RegistrationFailedException.class)
    private ResponseEntity<ErrorResponse> handleRegistrationFailedException(RegistrationFailedException e) {
        ErrorResponse response = new ErrorResponse(e.getErrors());

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }
}