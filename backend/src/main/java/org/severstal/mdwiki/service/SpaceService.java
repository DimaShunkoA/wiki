package org.severstal.mdwiki.service;

import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.model.Space;
import org.severstal.mdwiki.repository.SpaceRepository;
import org.severstal.mdwiki.util.ResourceFetcher;
import org.severstal.mdwiki.util.exception.ElementAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * Сервис с логикой CRUD операций над сущностью Space
 */
@Service
@Transactional(readOnly = true)
public class SpaceService implements SpaceCrudService {

    /**
     * Репозиторий для взаимодействия с сущностью Space
     */
    private final SpaceRepository spaceRepository;

    /**
     * Компонент для получения ресурсов
     */
    private final ResourceFetcher resourceFetcher;

    /**
     * Конструктор для автоматичекого внедрения зависимостей
     * @param spaceRepository репозиторий для взаимодействия с сущностью Space
     * @param resourceFetcher компонент для получения ресурсов
     */
    @Autowired
    public SpaceService(SpaceRepository spaceRepository, ResourceFetcher resourceFetcher) {
        this.spaceRepository = spaceRepository;
        this.resourceFetcher = resourceFetcher;
    }

    /**
     * Метод, отвечающий за создание нового пространства
     * @param space пространство, которое нужно сохранить
     * @return сохраненное пространство
     * @throws ElementAlreadyExistsException если пространство уже существует
     */
    @Override
    @Transactional
    public Space create(Space space) {
        Person user = resourceFetcher.getLoggedInUser();

        if (spaceRepository.findByOwnerAndName(user, space.getName()).isPresent()){
            throw new ElementAlreadyExistsException("Пространство с таким именем уже существует");
        }

        space.setOwner(user);
        Date now = new Date();
        space.setCreatedAt(now);
        space.setUpdatedAt(now);
        space.setId(spaceRepository.save(space).getId());

        return space;
    }

    /**
     * Метод, отвечающий за получение всех пользовательских пространств
     * @return список пользовательских всех пространств
     */
    @Override
    public List<Space> get() {
        Person user = resourceFetcher.getLoggedInUser();

        return spaceRepository.findByOwner(user);
    }


    /**
     * Метод, отвечающий за получение пространства
     * @param id ID пространства
     * @return найденое пространтво
     */
    @Override
    public Space get(int id){
        Space space = resourceFetcher.fetchSpace(id);

        return space;
    }

    /**
     * Метод, отвечающий за обновление пространства
     * @param id ID пространства
     * @param spaceToUpdateWith пространство, значениями полей которого нужно обновить требуемое пространство
     * @return обновленное пространство
     * @throws ElementAlreadyExistsException если пространство уже существует
     */
    @Override
    @Transactional
    public Space update(int id, Space spaceToUpdateWith) {
        Space space = resourceFetcher.fetchSpace(id);
        Person user = resourceFetcher.getLoggedInUser();

        if (spaceRepository.findByOwnerAndName(user, spaceToUpdateWith.getName()).isPresent()){
            throw new ElementAlreadyExistsException("Пространство с таким именем уже существует");
        }

        space.setName(spaceToUpdateWith.getName());
        space.setShared(spaceToUpdateWith.isShared());

        spaceRepository.save(space);

        return space;
    }

    /**
     * Метод, отвечающий за удаление пространства
     * @param id ID пространства
     */
    @Override
    @Transactional
    public void delete(int id) {
        Space space = resourceFetcher.fetchSpace(id);

        spaceRepository.delete(space);
    }
}