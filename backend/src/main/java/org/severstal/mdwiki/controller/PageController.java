package org.severstal.mdwiki.controller;

import org.modelmapper.ModelMapper;
import org.severstal.mdwiki.dto.page.PageRequest;
import org.severstal.mdwiki.dto.page.PageResponse;
import org.severstal.mdwiki.model.Page;
import org.severstal.mdwiki.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedList;
import java.util.List;

/**
 * REST контроллер для CRUD операций над сущностью Page
 */
@RestController
@RequestMapping("/spaces/{spaceId}/pages")
public class PageController {

    /**
     * Сервис с логикой CRUD операций над сущностью Page
     */
    private final PageService pageService;
    /**
     * Маппер для конвертации сущностей
     */
    private final ModelMapper modelMapper;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param pageService сервис с логикой CRUD операций над сущностью Page
     * @param modelMapper маппер для конвертации сущностей
     */
    @Autowired
    public PageController(PageService pageService, ModelMapper modelMapper) {
        this.pageService = pageService;
        this.modelMapper = modelMapper;
    }

    /**
     * Метод, отвечающий за создание новой страницы
     * @param spaceId ID пространства, в котором нужно создать страницу
     * @param pageRequest DTO сущности Page для запроса
     * @return DTO сущности Page для ответа с кодом 201
     */
    @PostMapping
    private ResponseEntity<PageResponse> create(@PathVariable(name = "spaceId") int spaceId,
                                                @RequestBody @Valid PageRequest pageRequest) {
        Page page = modelMapper.map(pageRequest, Page.class);

        Page createdPage = pageService.create(page, spaceId);

        PageResponse response = modelMapper.map(createdPage, PageResponse.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Метод, отвечающий за создание новой подстраницы
     * @param spaceId ID пространства, в котором нужно создать подстраницу
     * @param parentId ID страницы-родителя
     * @param pageRequest DTO сущности Page для запроса
     * @return DTO сущности Page для ответа с кодом 201
     */
    @PostMapping("/{parentId}")
    public ResponseEntity<PageResponse> createSubpage(@PathVariable(name = "spaceId") int spaceId,
                                                      @PathVariable(name = "parentId") int parentId,
                                                      @RequestBody @Valid PageRequest pageRequest) {
        Page subpage = modelMapper.map(pageRequest, Page.class);

        Page createdSubpage = pageService.createSubpage(subpage, parentId, spaceId);

        PageResponse response = modelMapper.map(createdSubpage, PageResponse.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Метод, отвечающий за получение всех страниц данного пространства
     * @param spaceId ID пространства
     * @return список DTO сущности Page для ответа с кодом 200
     */
    @GetMapping
    public ResponseEntity<List<PageResponse>> get(@PathVariable(name = "spaceId") int spaceId) {
        List<PageResponse> pages = new LinkedList<>();

        for (Page page: pageService.get(spaceId)) {
            PageResponse pageResponse = modelMapper.map(page, PageResponse.class);
            pages.add(pageResponse);
        }

        return new ResponseEntity<>(pages, HttpStatus.OK);
    }

    /**
     * Метод, отвечающий за получение родителя страницы
     * @param spaceId ID пространства
     * @param pageId ID страницы, родителя которой нужно получить
     * @return DTO сущности Page для ответа с кодом 200
     */
    @GetMapping("/{pageId}/parent")
    public ResponseEntity<PageResponse> getParent(@PathVariable(name = "spaceId") int spaceId,
                                                  @PathVariable(name = "pageId") int pageId) {
        Page parent = pageService.getParent(pageId, spaceId);

        PageResponse response = modelMapper.map(parent, PageResponse.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Метод, отвечающий за получение страницы по его ID для данного пространства
     * @param spaceId ID пространства
     * @param pageId ID страницы
     * @return DTO сущности Page для ответа с кодом 200
     */
    @GetMapping("/{pageId}")
    public ResponseEntity<PageResponse> get(@PathVariable(name = "spaceId") int spaceId,
                                            @PathVariable(name = "pageId") int pageId) {
        Page page = pageService.get(pageId, spaceId);

        PageResponse response = modelMapper.map(page, PageResponse.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Метод, отвечающий за обновление страницы с заданым ID для данного пространства
     * @param spaceId ID пространства
     * @param pageId ID страницы
     * @param pageRequest DTO сущности Page для запроса
     * @return DTO сущности Page для ответа с кодом 200
     */
    @PutMapping("/{pageId}")
    private ResponseEntity<PageResponse> update(@PathVariable(name = "spaceId") int spaceId,
                                                @PathVariable(name = "pageId") int pageId,
                                                @RequestBody @Valid PageRequest pageRequest ) {
        Page pageToUpdateWith = modelMapper.map(pageRequest, Page.class);

        Page updatedPage = pageService.update(pageId, spaceId, pageToUpdateWith);

        PageResponse response = modelMapper.map(updatedPage, PageResponse.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Метод, отвечающий за удаление страницы с заданым ID данного пространства
     * @param spaceId ID пространства
     * @param pageId ID страницы
     * @return пустой ответ с кодом 204
     */
    @DeleteMapping("/{pageId}")
    public ResponseEntity<HttpStatus> delete(@PathVariable(name = "spaceId") int spaceId,
                                             @PathVariable(name = "pageId") int pageId) {
        pageService.delete(pageId, spaceId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}