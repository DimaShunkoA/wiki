package org.severstal.mdwiki.repository;

import org.severstal.mdwiki.model.Person;
import org.severstal.mdwiki.model.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторий для взаимодействия с сущностью Space
 */
@Repository
public interface SpaceRepository extends JpaRepository<Space, Integer> {

    /**
     * Поиск пользовательских пространств
     * @return возвращает список найденых пространтсв
     */
    List<Space> findByOwner(Person owner);

    /**
     * Поиск пользовательсого пространства по названию
     * @return возвращает найденое пространтсво
     */
    Optional<Space> findByOwnerAndName(Person owner, String name);
}
