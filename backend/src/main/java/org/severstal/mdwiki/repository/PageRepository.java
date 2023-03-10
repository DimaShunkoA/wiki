package org.severstal.mdwiki.repository;

import org.severstal.mdwiki.model.Page;
import org.severstal.mdwiki.model.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для взаимодействия с сущностью Page
 */
@Repository
public interface PageRepository extends JpaRepository<Page, Integer> {

    /**
     * Поиск записи данного пространства
     * @param id ID записи
     * @param space пространство, в котором ищутся записи
     * @return возвращает найденую запись
     */
    Optional<Page> findByIdAndSpace(int id, Space space);

    /**
     * Поиск корневых записей данного пространства
     * @param space пространство, в котором ищутся записи
     * @return возвращает список найденых записней
     */
    List<Page> findBySpaceAndParentIsNull(Space space);

    /**
     * Поиск записи данного пространства по названию
     * @param space пространство, в котором ищутся записи
     * @param name имя записи
     * @return возвращает найденую запись
     */
    Optional<Page> findBySpaceAndName(Space space, String name);
}