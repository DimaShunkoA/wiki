package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Page;
import org.severstal.mdwiki.model.Space;
import org.severstal.mdwiki.repository.PageRepository;
import org.severstal.mdwiki.util.ResourceFetcher;
import org.severstal.mdwiki.util.exception.ElementAlreadyExistsException;
import org.severstal.mdwiki.util.exception.ElementNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * Сервис с логикой CRUD операций над сущностью Page
 */
@Service
@Transactional(readOnly = true)
public class PageService implements PageCrudService {

    /**
     * Репозиторий для взаимодействия с сущностью Page
     */
    private final PageRepository pageRepository;

    /**
     * Компонент для получения ресурсов
     */
    private final ResourceFetcher resourceFetcher;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param pageRepository  репозиторий для взаимодействия с сущностью Page
     * @param resourceFetcher компонент для получения ресурсов
     */
    @Autowired
    public PageService(PageRepository pageRepository, ResourceFetcher resourceFetcher) {
        this.pageRepository = pageRepository;
        this.resourceFetcher = resourceFetcher;
    }

    /**
     * Метод, отвечающий за создание новой страницы
     * @param page страница, которую нужно сохранить
     * @param spaceId ID пространства, в котором нужно создать страницу
     * @return сохраненную страницу
     * @throws ElementAlreadyExistsException если страница уже существует
     */
    @Override
    @Transactional
    public Page create(Page page, int spaceId){
        Space space = resourceFetcher.fetchSpace(spaceId);

        if (pageRepository.findBySpaceAndName(space, page.getName()).isPresent()){
            throw new ElementAlreadyExistsException("Страница с таким именем уже существует в этом пространстве");
        }

        page.setSpace(space);
        Date now = new Date();
        page.setCreatedAt(now);
        page.setUpdatedAt(now);
        page.setSubpages(Collections.emptyList());
        page.setId(pageRepository.save(page).getId());

        return page;
    }

    /**
     * Метод, отвечающий за создание подстраницы
     * @param subpage подстраница, которую нужно сохранить
     * @param parentId ID страницы-родителя, для которого нужно создать подстраницу
     * @param spaceId ID пространства, в котором нужно создать подстраницу
     * @return сохраненную подстраницу
     * @throws ElementAlreadyExistsException если страница уже существует
     */
    @Override
    @Transactional
    public Page createSubpage(Page subpage, int parentId, int spaceId) {
        Page parent = resourceFetcher.fetchPage(parentId, spaceId);

        Space space = parent.getSpace();

        if (pageRepository.findBySpaceAndName(space, subpage.getName()).isPresent()){
            throw new ElementAlreadyExistsException("Страница с таким именем уже существует в этом пространстве");
        }

        subpage.setSpace(parent.getSpace());
        subpage.setParent(parent);
        Date now = new Date();
        subpage.setCreatedAt(now);
        subpage.setUpdatedAt(now);
        subpage.setId(pageRepository.save(subpage).getId());

        return subpage;
    }

    /**
     * Метод, отвечающий за получение всех страниц пространства
     * @param spaceId ID пространтсва, в котором нужно получить страницы
     * @return список всех страниц данного пространства
     */
    @Override
    public List<Page> get(int spaceId) {
        Space space = resourceFetcher.fetchSpace(spaceId);

        return pageRepository.findBySpaceAndParentIsNull(space);
    }

    /**
     * Метод, отвечающий за получение страницы
     * @param pageId ID страницы
     * @param spaceId ID пространтсва, в котором нужно получить страницу
     * @return найденую страницу
     */
    @Override
    public Page get(int pageId, int spaceId) {
        Page page = resourceFetcher.fetchPage(pageId, spaceId);

        return page;
    }

    /**
     * Метод, отвечающий за получение страницы-родителя
     * @param pageId ID страница, родителя которой нужно получить
     * @param spaceId ID пространтсва, в котором нужно получить страницу
     * @return найденую страницу
     * @throws ElementNotFoundException если страница не найдена
     */
    @Override
    public Page getParent(int pageId, int spaceId) {
        Page page = resourceFetcher.fetchPage(pageId, spaceId);

        Page parent = page.getParent();
        if (parent == null) {
            throw new ElementNotFoundException("Страница не найдена");
        }

        return parent;
    }

    /**
     * Метод, отвечающий за обновление страницы
     * @param pageId ID страницы
     * @param spaceId ID пространтсва, в котором нужно обновить страницу
     * @param pageToUpdateWith страница, значениями полей которой нужно обновить требуемую страницу
     * @return обновленную страницу
     * @throws ElementAlreadyExistsException если страница уже существует
     */
    @Override
    @Transactional
    public Page update(int pageId, int spaceId, Page pageToUpdateWith) {
        Page page = resourceFetcher.fetchPage(pageId, spaceId);

        Space space = page.getSpace();

        if (pageRepository.findBySpaceAndName(space, pageToUpdateWith.getName()).isPresent()){
            throw new ElementAlreadyExistsException("Страница с таким именем уже существует в этом пространстве");
        }

        page.setName(pageToUpdateWith.getName());
        page.setShared(pageToUpdateWith.isShared());

        pageRepository.save(page);

        return page;
    }

    /**
     * Метод, отвечающий за удаление страницы
     * @param pageId ID страницы
     * @param spaceId ID пространтсва, в котором нужно удалить страницу
     */
    @Override
    @Transactional
    public void delete(int pageId, int spaceId) {
        Page page = resourceFetcher.fetchPage(pageId, spaceId);

        pageRepository.delete(page);
    }
}