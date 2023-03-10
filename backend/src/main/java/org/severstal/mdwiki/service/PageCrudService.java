package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Page;

import java.util.List;

/**
 * Интерфейс сервиса CRUD операций над сущностью Page
 */
public interface PageCrudService {

    /**
     * Создание новой страницы
     * @param page страница, которую нужно сохранить
     * @param spaceId x
     * @return созданную страницу
     */
    Page create(Page page, int spaceId);

    /**
     * Создание новой подстраницы
     * @param subpage подстраницы, которую нужно сохранить
     * @param parentId ID страницы-родителя, для которого нужно создать подстраницу
     * @param spaceId ID пространства, в котором нужно создать подстраницу
     * @return созданую подстраницу
     */
    Page createSubpage(Page subpage, int parentId, int spaceId);

    /**
     * Получение всех страниц в пространстве
     * @param spaceId ID пространства, в котором нужно получить страницы
     * @return список найденых страниц
     */
    List<Page> get(int spaceId);

    /**
     * Получение страницы-родителя
     * @param id ID страница, родителя которой нужно получить
     * @param spaceId ID пространтсва, в котором нужно получить страницу
     * @return найденую страницу
     */
    Page getParent(int id, int spaceId);

    /**
     * Получение страницы в пространстве по её ID
     * @param id ID страницы
     * @param spaceId ID пространства, в котором нужно найти страницу
     * @return найденую страницу
     */
    Page get(int id, int spaceId);

    /**
     * Обновление странцы в пространстве по её ID
     * @param id ID страницы
     * @param spaceId ID пространства, в котором нужно обновить страницу
     * @param pageToUpdateWith объект Page, значениями полей которого нужно обновить страницу
     * @return обновленную страницу
     */
    Page update(int id, int spaceId, Page pageToUpdateWith);

    /**
     * Удаление страницы по её ID
     * @param id ID страницы
     * @param spaceId ID пространства, в котором нужно удалить страницу
     */
    void delete(int id, int spaceId);
}
