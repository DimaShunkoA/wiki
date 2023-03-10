package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Person;

/**
 * Интерфейс сервиса CRUD операций над сущностью Person
 */
public interface PersonCrudService {

    /**
     * Обновление заметки пользователя по его ID
     * @param id ID пользователя
     * @param note обновленная заметка
     * @return обновленного пользователя
     */
    Person noteUpdate(int id, String note);

}
