package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Document;

/**
 * Интерфейс сервиса CRUD операций над сущностью Document
 */
public interface DocumentCrudService {

    /**
     * Создание нового документа
     * @param document документ, который нужно сохранить
     * @param pageId ID страницы, в которой нужно создать документ
     * @param spaceId ID пространства, в котором нужно создать документ
     * @return созданный документ
     */
    Document create(Document document, int pageId, int spaceId);

    /**
     * Получение документа на странице
     * @param pageId ID страницы, в которой нужно получить документ
     * @param spaceId ID пространства, в котором нужно получить документ
     * @return найденый документ
     */
    Document get(int pageId, int spaceId);

    /**
     * Обновить документ на странице
     * @param pageId ID страницы, в которой нужно обновить документ
     * @param spaceId ID пространства, в котором нужно обновить документ
     * @param documentToUpdateWith объект класса Document, значениями полей которого нужно обновить документ
     * @return обновленный документ
     */
    Document update(int pageId, int spaceId, Document documentToUpdateWith);
}
