package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Document;
import org.severstal.mdwiki.model.Page;
import org.severstal.mdwiki.repository.DocumentRepository;
import org.severstal.mdwiki.util.ResourceFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Сервис с логикой CRUD операций над сущностью Document
 */
@Service
@Transactional(readOnly = true)
public class DocumentService implements DocumentCrudService {


    /**
     * Репозиторий для взаимодействия с сущностью Document
     */
    private final DocumentRepository documentRepository;

    /**
     * Компонент для получения ресурсов
     */
    private final ResourceFetcher resourceFetcher;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param documentRepository репозиторий для взаимодействия с сущностью Document
     * @param resourceFetcher компонент для получения ресурсов
     */
    @Autowired
    public DocumentService(DocumentRepository documentRepository,
                           ResourceFetcher resourceFetcher) {
        this.documentRepository = documentRepository;
        this.resourceFetcher = resourceFetcher;
    }

    /**
     * Метод, отвечающий за создание нового документа
     * @param document документ, который нужно сохранить
     * @param pageId ID страницы, в которой нужно создать документ
     * @param spaceId ID пространства, в котором нужно создать документ
     * @return сохраненный документ
     */
    @Override
    @Transactional
    public Document create(Document document, int pageId, int spaceId){
        Page page = resourceFetcher.fetchPage(pageId, spaceId);

        document.setPage(page);
        document.setId(documentRepository.save(document).getId());

        return document;
    }

    /**
     * Метод, отвечающий за получение документа
     * @param pageId ID страницы, в которой нужно найти документ
     * @param spaceId ID пространства, в котором нужно найти документ
     * @return найденый документ
     */
    @Override
    @Transactional
    public Document get(int pageId, int spaceId) {
        Document document = resourceFetcher.fetchDocument(pageId, spaceId);

        return document;
    }

    /**
     * Метод, отвечающий за обновление документа
     * @param pageId ID страницы, в которой нужно обновить документ
     * @param spaceId ID пространства, в котором нужно обновить документ
     * @param documentToUpdateWith документ, значениями полей которого нужно обновить требуемый документ
     * @return обновленный документ
     */
    @Override
    @Transactional
    public Document update(int pageId, int spaceId, Document documentToUpdateWith) {
        Document document = resourceFetcher.fetchDocument(pageId, spaceId);

        document.setText(documentToUpdateWith.getText());

        documentRepository.save(document);

        return document;
    }
}